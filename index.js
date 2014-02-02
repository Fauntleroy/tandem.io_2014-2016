var express = require('express');
var server = express();

server.get( '/', function( req, res ){
	res.send('quicksync');
});

server.listen( 8080 );