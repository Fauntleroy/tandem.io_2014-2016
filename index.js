const PORT = 8080;
const SESSION_SECRET = process.env.QUICKSYNC_SESSION_SECRET;
const SOUNDCLOUD_APP_ID = process.env.QUICKSYNC_SOUNDCLOUD_APP_ID;
const SOUNDCLOUD_APP_SECRET = process.env.QUICKSYNC_SOUNDCLOUD_APP_SECRET;
const YOUTUBE_APP_ID = process.env.QUICKSYNC_YOUTUBE_APP_ID;
const YOUTUBE_APP_SECRET = process.env.QUICKSYNC_YOUTUBE_APP_SECRET;
const YOUTUBE_API_KEY = process.env.QUICKSYNC_YOUTUBE_API_KEY;
const URL = 'http://dev.quick.tksync.com:8080';
const SOUNDCLOUD_API_BASE_URL = 'https://api.soundcloud.com';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

var _ = require('underscore');
var request = require('request');
var express = require('express');
var server = express();

// Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quicksync');

var Room = mongoose.model( 'Room', {
	name: String,
	users: [{
		name: String
	}],
	playlist: [{
		title: String,
		image: String,
		provider: String,
		url: String,
		media_url: String,
		duration: Number
	}],
	player: {
		elapsed: Number
	}
});

// Set up templates for Express
var express_handlebars = require('express3-handlebars');
var handlebars = express_handlebars({
	extname: '.hbs',
	defaultLayout: false,
});
server.engine( 'hbs', handlebars );
server.set( 'view engine', 'hbs' );

// Static file serving
server.use( express.static( __dirname + '/assets' ) );

// Sessions
var MongoStore = require('connect-mongo')( express );
server.use( express.cookieParser() );
server.use( express.bodyParser() );
server.use( express.session({
	secret: SESSION_SECRET,
	store: new MongoStore({
		db: 'quicksync'
	})
}) );

// Passport stuff
var passport = require('passport');

server.use( passport.initialize() );
server.use( passport.session() );

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
		soundcloud_access_token: access_token,
		soundcloud_access_token_expiry: Date.now() + ( params.expires_in * 1000 ),
		soundcloud_refresh_token: refresh_token
	};
	// if we already have a user session, merge them
	if( req.user ){
		user = _.extend( req.user, user );
	}
	done( null, user );
}));

// Youtube login
var passport_youtube = require('passport-youtube');
var YoutubeStrategy = passport_youtube.Strategy;

passport.use( new YoutubeStrategy({
	clientID: YOUTUBE_APP_ID,
	clientSecret: YOUTUBE_APP_SECRET,
	callbackURL: URL +'/auth/youtube/callback',
	passReqToCallback: true
}, function( req, access_token, refresh_token, params, profile, done ){
	var user = {
		youtube_id: profile.id,
		youtube_access_token: access_token,
		youtube_access_token_expiry: Date.now() + ( params.expires_in * 1000 ),
		youtube_refresh_token: refresh_token
	};
	// if we already have a user session, merge them
	if( req.user ){
		user = _.extend( req.user, user );
	}
	done( null, user );
}));

// Routes
server.get( '/auth/soundcloud',	passport.authenticate('soundcloud') );

server.get( '/auth/soundcloud/callback', passport.authenticate( 'soundcloud', {
	successRedirect: '/',
	failureRedirect: '/?err=soundcloud-login-failed'
}));

server.get( '/auth/youtube', passport.authenticate( 'youtube', {
	scope: 'https://www.googleapis.com/auth/youtube'
}));

server.get( '/auth/youtube/callback', passport.authenticate( 'youtube', {
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

server.get( /^\/api\/v1\/proxy\/soundcloud\/(.+)$/, function( req, res ){
	var query = _.extend( req.query, {
		oauth_token: req.user.soundcloud_access_token
	});
	var endpoint = req.params[0];
	request({
		url: SOUNDCLOUD_API_BASE_URL +'/'+ endpoint,
		qs: query
	}).pipe( res );
});

server.get( /^\/api\/v1\/proxy\/youtube\/(.+)$/, function( req, res ){
	var query = _.extend( req.query, {
		key: YOUTUBE_API_KEY
	});
	var endpoint = req.params[0];
	request({
		url: YOUTUBE_API_BASE_URL +'/'+ endpoint,
		qs: query,
		headers: {
			'Authorization': 'Bearer '+ req.user.youtube_access_token
		}
	}).pipe( res );
});

server.get( '/logout', function( req, res ){
	req.logout();
	res.redirect('/');
});

var renderIndex = function( req, res ){
	console.log( 'req.user', req.user );
	res.render('index.hbs');
};

server.get( '/', renderIndex );
server.get( '/rooms/:id', renderIndex );

server.listen( PORT );

console.log('[quicksync] listening on port', PORT );