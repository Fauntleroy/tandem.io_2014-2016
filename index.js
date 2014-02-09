const PORT = 8080;
const SESSION_SECRET = process.env.QUICKSYNC_SESSION_SECRET;
const SOUNDCLOUD_APP_ID = process.env.QUICKSYNC_SOUNDCLOUD_APP_ID;
const SOUNDCLOUD_APP_SECRET = process.env.QUICKSYNC_SOUNDCLOUD_APP_SECRET;
const YOUTUBE_APP_ID = process.env.QUICKSYNC_YOUTUBE_APP_ID;
const YOUTUBE_APP_SECRET = process.env.QUICKSYNC_YOUTUBE_APP_SECRET;
const URL = 'http://dev.quick.tksync.com:8080';

var _ = require('underscore');
var express = require('express');
var server = express();

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

// Passport stuffhttps://www.googleapis.com/auth/youtube
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
}, function( req, access_token, refresh_token, profile, done ){
	var user = {
		soundcloud_id: profile.id,
		soundcloud_access_token: access_token,
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
}, function( req, access_token, refresh_token, profile, done ){
	var user = {
		youtube_id: profile.id,
		youtube_access_token: access_token,
		youtube_refresh_token: refresh_token
	};
	// if we already have a user session, merge them
	if( req.user ){
		user = _.extend( req.user, user );
	}
	done( null, user );
}));

// Routes
server.get( '/', function( req, res ){
	res.render('index.hbs');
	console.log( 'req.user', req.user );
});

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

server.get( '/logout', function( req, res ){
	req.logout();
	res.redirect('/');
});

server.listen( PORT );

console.log('[quicksync] listening on port', PORT );