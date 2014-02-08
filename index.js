const PORT = 8080;

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

server.get( '/', function( req, res ){
	res.render('index.hbs');
});

server.listen( PORT );

console.log('[quicksync] listening on port', PORT );