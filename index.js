const PORT = 8080;
const SESSION_SECRET = process.env.TANDEM_SESSION_SECRET;
const SOUNDCLOUD_APP_ID = process.env.TANDEM_SOUNDCLOUD_APP_ID;
const SOUNDCLOUD_APP_SECRET = process.env.TANDEM_SOUNDCLOUD_APP_SECRET;
const YOUTUBE_APP_ID = process.env.TANDEM_YOUTUBE_APP_ID;
const YOUTUBE_APP_SECRET = process.env.TANDEM_YOUTUBE_APP_SECRET;
const YOUTUBE_API_KEY = process.env.TANDEM_YOUTUBE_API_KEY;
const MONGO_URL = process.env.TANDEM_MONGO_URL || 'mongodb://localhost/tandem';
const URL = process.env.TANDEM_URL || 'http://dev.tandem.io:8080';
const ENV = process.env.NODE_ENV;
const SOUNDCLOUD_API_BASE_URL = 'https://api.soundcloud.com';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const NO_OP = function(){};

var http = require('http');
var socket_io = require('socket.io');
var async = require('async');
var _ = require('underscore');
var request = require('request');
var express = require('express');
var expose = require('express-expose');
var server = express();
var http_server = http.createServer( server );
var io = socket_io.listen( http_server );

var generateAuthToken = require('./utils/generateAuthToken.js');

var Room = require('./models/room.js')({ io: io });

// Database
var mongoose = require('mongoose');
mongoose.connect( MONGO_URL );

// Set up templates for Express
var express_handlebars = require('express3-handlebars');
var handlebars = express_handlebars({
	extname: '.hbs',
	defaultLayout: false,
});
server.engine( 'hbs', handlebars );
server.set( 'view engine', 'hbs' );

// Static file serving
server.use( express.compress() );
server.use( express.static( __dirname + '/assets' ) );

// Sessions
var MongoStore = require('connect-mongo')( express );
server.use( express.cookieParser() );
server.use( express.bodyParser() );
server.use( express.session({
	secret: SESSION_SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks from now
	},
	store: new MongoStore({
		url: MONGO_URL
	})
}) );

// Pass environment to views
server.locals.dev = ( ENV === 'development' );

// Passport stuff
var passport = require('passport');
var guestSetup = require('./middleware/guest.js');

server.use( passport.initialize() );
server.use( passport.session() );
server.use( guestSetup );

passport.serializeUser( function( user, done ){
	done( null, user );
});

passport.deserializeUser( function( obj, done ){
	done( null, obj );
});

// Soundcloud login
var passport_soundcloud = require('passport-soundcloud');
var SoundcloudStrategy = passport_soundcloud.Strategy;

passport.use( new SoundcloudStrategy({
	clientID: SOUNDCLOUD_APP_ID,
	clientSecret: SOUNDCLOUD_APP_SECRET,
	callbackURL: URL +'/auth/soundcloud/callback',
	passReqToCallback: true
}, function( req, access_token, refresh_token, params, profile, done ){
	var user = {
		soundcloud_id: profile.id,
		soundcloud_access_token: access_token
	};
	// if we already have a user session, merge them
	if( req.user ){
		user = _.extend( req.user, user );
	}
	done( null, user );
}));

// Youtube login
var passport_google = require('passport-google-oauth');
var GoogleStrategy = passport_google.OAuth2Strategy;

var getLikesID = function( access_token, callback ){
	callback = callback || NO_OP;
	request({
		url: YOUTUBE_API_BASE_URL +'/channels',
		qs: {
			part: 'contentDetails',
			mine: true
		},
		headers: {
			'Authorization': 'Bearer '+ access_token
		},
		method: 'GET',
		json: true
	}, function( err, res, body ){
		callback( err, body.items[0].contentDetails.relatedPlaylists.likes );
	});
};

passport.use( new GoogleStrategy({
	clientID: YOUTUBE_APP_ID,
	clientSecret: YOUTUBE_APP_SECRET,
	callbackURL: URL +'/auth/youtube/callback',
	profileURL: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
	passReqToCallback: true
}, function( req, access_token, refresh_token, params, profile, done ){
	var user = {
		youtube_id: profile.id,
		youtube_access_token: access_token,
		youtube_access_token_expiry: Date.now() + ( params.expires_in * 1000 ),
		youtube_refresh_token: refresh_token
	};
	// get ID of user's likes playlist
	getLikesID( access_token, function( err, likes_id ){
		user.youtube_likes_id = likes_id;
		// if we already have a user session, merge them
		if( req.user ){
			user = _.extend( req.user, user );
		}
		done( null, user );
	});
}));

// Routes
server.get( '/auth/soundcloud',	passport.authenticate( 'soundcloud', {
	scope: 'non-expiring'
}));

server.get( '/auth/soundcloud/callback', passport.authenticate( 'soundcloud', {
	successRedirect: '/',
	failureRedirect: '/?err=soundcloud-login-failed'
}));

server.get( '/auth/youtube', passport.authenticate( 'google', {
	scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
	accessType: 'offline',
	approvalPrompt: 'force'
}));

server.get( '/auth/youtube/callback', passport.authenticate( 'google', {
	successRedirect: '/',
	failureRedirect: '/?err=youtube-login-failed'
}));

server.post( '/api/v1/rooms', function( req, res ){
	var room = new Room;
	room.save( function( err, room ){
		res.json( room );
	});
});

server.get( '/api/v1/rooms/:id?', function( req, res ){
	if( req.params.id ){
		Room.findById( req.params.id, function( err, room ){
			res.json( room );
		});
	}
	else {
		Room.find( function( err, rooms ){
			res.json( rooms );
		});
	}
});

server.put( '/api/v1/rooms/:id', function( req, res ){
	var new_data = _.omit( req.body, '_id' );
	Room.findByIdAndUpdate( req.params.id, new_data, function( err, room ){
		res.json( room );
	});
});

server.delete( '/api/v1/rooms/:id', function( req, res ){
	Room.findByIdAndRemove( req.params.id, function( err, room ){
		res.json( room );
	});
});

server.all( /^\/api\/v1\/proxy\/soundcloud\/(.+)$/, function( req, res ){
	var query = _.extend( req.query, {
		oauth_token: req.user.soundcloud_access_token
	});
	var endpoint = req.params[0];
	request({
		url: SOUNDCLOUD_API_BASE_URL +'/'+ endpoint,
		qs: query,
		method: req.method
	}).pipe( res );
});

// use refresh_token to get a new access_token
var refreshYouTubeToken = function( refresh_token, cb ){
	request({
		url: 'https://accounts.google.com/o/oauth2/token',
		form: {
			client_id: YOUTUBE_APP_ID,
			client_secret: YOUTUBE_APP_SECRET,
			refresh_token: refresh_token,
			grant_type: 'refresh_token'
		},
		method: 'POST'
	}, function( err, res, body ){
		if( err ) return cb( err, null );
		body = JSON.parse( body );
		if( body.error ) return cb( new Error( body.error +' '+ body.error_description ), null );
		cb( null, body.access_token, body.expires_in );
	});
};

server.all( /^\/api\/v1\/proxy\/youtube\/(.+)$/, function( req, res ){
	if( !req.user.youtube_access_token ) return res.json( 500, { error: 'Error: Missing access token' });
	async.waterfall([ function checkToken( next ){
		if( Date.now() > req.user.youtube_access_token_expiry ){
			refreshYouTubeToken( req.user.youtube_refresh_token, function( err, access_token, expires_in ){
				if( err ) return next( err, null );
				req.user.youtube_access_token = access_token;
				req.user.youtube_access_token_expiry = Date.now() + ( expires_in * 1000 );
				next( null, access_token );
			});
		}
		else {
			next( null, req.user.youtube_access_token );
		}
	}, function makeRequest( access_token, next ){
		var query = _.extend( req.query, {
			key: YOUTUBE_API_KEY
		});
		var endpoint = req.params[0];
		var proxied_request = request({
			url: YOUTUBE_API_BASE_URL +'/'+ endpoint,
			qs: query,
			json: !_.isEmpty( req.body ) ? req.body : null,
			headers: {
				'Authorization': 'Bearer '+ access_token
			},
			method: req.method
		});
		next( null, proxied_request );
	}], function( err, proxied_request ){
		if( err ) return res.json( 500, { error: err.toString() });
		proxied_request.pipe( res );
	});
});

server.get( '/logout', function( req, res ){
	req.logout();
	res.redirect('/');
});

server.post( '/rooms', function( req, res ){
	var room = new Room;
	res.redirect( '/rooms/'+ room.id );
});

server.get( '/rooms/:id', function( req, res ){
	var user = req.session.passport.user || {};
	user = _.pick( user, 'id', 'name', 'avatar', 'youtube_id', 'youtube_likes_id', 'soundcloud_id' );
	user.token = generateAuthToken( user.id, user.name, user.avatar );
	var room = Room.findById( req.params.id, true );
	res.expose( room, 'tandem.bridge.room' );
	res.expose( user, 'tandem.bridge.user' );
	res.expose( {
		soundcloud: {
			client_id: SOUNDCLOUD_APP_ID
		}
	}, 'tandem.bridge.apis' );
	res.render( 'room.hbs', {
		room: room,
		user: user
	});
});

var renderIndex = function( req, res ){
	var rooms = Room.list( true );
	res.render( 'index.hbs', {
		rooms: rooms
	});
};

server.get( '/', renderIndex );
server.get( '/rooms/:id', renderIndex );

http_server.listen( PORT );

console.log('[tandem] listening on port', PORT );