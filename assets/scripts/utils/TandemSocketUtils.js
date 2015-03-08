var querystring = require('querystring');
var io = require('socket.io-client');

var PlayerServerActionCreator = require('../actions/PlayerServerActionCreator');

var socket = io.connect( '/rooms/'+ tandem.bridge.room.id, {
	query: querystring.stringify({
		token: tandem.bridge.user.token,
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		avatar: tandem.bridge.user.avatar
	})
});

var _onReceiveState = function( state ){
	PlayerServerActionCreator.receiveState( state );
};

var _onReceivePlay = function( item ){
	PlayerServerActionCreator.receiveItem( item );
};

var _onReceiveElapsedTime = function( elapsed_time ){
	PlayerServerActionCreator.receiveElapsedTime( elapsed_time );
};

var _onReceiveSkip = function( skip_data ){
	PlayerServerActionCreator.receiveSkipItem( skip_data.item, skip_data.user );
};

var _onReceiveLike = function( like_data ){
	PlayerServerActionCreator.receiveLikeItem( like_data.likers, like_data.liker, like_data.message );
};

var _onReceiveOrder = function( order ){
	PlayerServerActionCreator.receiveSetOrder( order );
};

socket.on( 'player:state', _onReceiveState );
socket.on( 'player:play', _onReceivePlay );
socket.on( 'player:elapsed', _onReceiveElapsedTime );
socket.on( 'player:skip', _onReceiveSkip );
socket.on( 'player:like', _onReceiveLike );
socket.on( 'player:order', _onReceiveOrder );

var TandemSocketUtils = {
	setOrder: function( order ){
		socket.emit( 'player:order', order );
	},
	skipItem: function(){
		socket.emit( 'player:skip' );
	},
	likeItem: function(){
		socket.emit( 'player:like' );
	}
};

module.exports = TandemSocketUtils;