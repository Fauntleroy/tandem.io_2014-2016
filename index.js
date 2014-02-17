const PORT = 8080;
const TOKEN_SECRET = process.env.QUICKSYNC_TOKEN_SECRET;
const SESSION_SECRET = process.env.QUICKSYNC_SESSION_SECRET;
const SOUNDCLOUD_APP_ID = process.env.QUICKSYNC_SOUNDCLOUD_APP_ID;
const SOUNDCLOUD_APP_SECRET = process.env.QUICKSYNC_SOUNDCLOUD_APP_SECRET;
const YOUTUBE_APP_ID = process.env.QUICKSYNC_YOUTUBE_APP_ID;
const YOUTUBE_APP_SECRET = process.env.QUICKSYNC_YOUTUBE_APP_SECRET;
const YOUTUBE_API_KEY = process.env.QUICKSYNC_YOUTUBE_API_KEY;
const URL = 'http://dev.quick.tksync.com:8080';
const SOUNDCLOUD_API_BASE_URL = 'https://api.soundcloud.com';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

var http = require('http');
var Stream = require('stream');
var crypto = require('crypto');
var es = require('event-stream');
var _ = require('underscore');
var request = require('request');
var express = require('express');
var expose = require('express-expose');
var server = express();
var http_server = http.createServer( server );

// generate auth token for use with streaming endpoints
var generateAuthToken = function( id ){
	var hmac = crypto.createHmac( 'sha256', TOKEN_SECRET );
	hmac.setEncoding('hex');
	hmac.write( id );
	hmac.end();
	return hmac.read();
};

// Sockets
var EngineServer = require('engine.io-stream');
var room_streams = {};

// Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quicksync');

var RoomSchema = new mongoose.Schema({
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
RoomSchema.post( 'init', function( room ){
	if( !room_streams[room.id] ){
		// create stream for all room data
		var room_stream = room_streams[room.id] = new Stream.Duplex({ objectMode: true });
		room_stream._read = function(){
		};
		room_stream._write = function( chunk, encoding, next ){
			this.push( chunk );
			next();
		};
		var engine = EngineServer( function( stream ){
			// stringify outgoing messages
			// parse incoming messages
			var stringify_stream = es.stringify();
			stringify_stream.pipe( stream );
			stream = es.duplex( stringify_stream, stream.pipe( es.parse() ) );
			// check user validity
			// close user connection if no auth sent in time
			var revokeAuth = function( reason ){
				reason = reason || 'Authentication error';
				stream.write({
					module: 'notifications',
					type: 'error',
					payload: {
						message: reason
					}
				});
				stream.end();
			};
			var checkAuth = function( id, token ){
				return generateAuthToken( id ) === token;
			};
			var auth_timeout = setTimeout( function(){
				revokeAuth('Authentication timed out');
			}, 15 * 1000 );
			stream.on( 'data', function( data ){
				if( data.type === 'auth' ){
					var id = data.payload.id;
					var token = data.payload.token;
					if( checkAuth( id, token ) ){
						clearTimeout( auth_timeout );
						// stream connection stream into room stream
						// stream room stream into connection stream
						stream
							.pipe( es.through( function( data ){
								data.user = {
									id: id
								};
								this.queue( data );
							}))
							.pipe( room_stream )
							.pipe( stream );
					}
					else {
						revokeAuth();
					}
				}
			});
		});
		engine.attach( http_server, '/streaming/rooms/'+ room.id );
	}
});
var Room = mongoose.model( 'Room', RoomSchema );

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

server.post( '/rooms', function( req, res ){
	var room = new Room;
	room.save( function( err, room ){
		res.redirect( '/rooms/'+ room.id );
	});
});

server.get( '/rooms/:id', function( req, res ){
	Room.findById( req.params.id, function( err, room ){
		var room_obj = room.toObject({ virtuals: true });
		var user_obj = _.pick( req.user, 'id', 'name' );
		user_obj.token = generateAuthToken( req.user.id );
		res.expose( room_obj, 'quicksync.bridge.room' );
		res.expose( user_obj, 'quicksync.bridge.user' );
		res.render( 'room.hbs', {
			room: room_obj
		});
	});
});

var renderIndex = function( req, res ){
	console.log( 'req.user', req.user );
	Room.find( function( err, rooms ){
		res.render( 'index.hbs', {
			rooms: rooms
		});
	});
};

server.get( '/', renderIndex );
server.get( '/rooms/:id', renderIndex );

http_server.listen( PORT );

console.log('[quicksync] listening on port', PORT );