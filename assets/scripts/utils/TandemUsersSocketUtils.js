var querystring = require('querystring');
var io = require('socket.io-client');

var UsersServerActionCreator = require('../actions/UsersServerActionCreator.js');

var socket = io.connect( '/rooms/'+ tandem.bridge.room.id, {
	query: querystring.stringify({
		token: tandem.bridge.user.token,
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		avatar: tandem.bridge.user.avatar
	})
});

var _onState = function( state ){
	UsersServerActionCreator.receiveState( state );
};

var _onJoin = function( user ){
	UsersServerActionCreator.receiveJoin( user );
};

var _onLeave = function( user ){
	UsersServerActionCreator.receiveLeave( user );
};

socket.on( 'presences:list', _onState );
socket.on( 'presences:join', _onJoin );
socket.on( 'presences:leave', _onLeave );

var TandemSocketUtils = {};

module.exports = TandemSocketUtils;