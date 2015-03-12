var TandemSocketConnection = require('./_TandemSocketConnection.js');
var PlayerServerActionCreator = require('../actions/PlayerServerActionCreator.js');

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
	PlayerServerActionCreator.receiveLikeItem( like_data.likers, like_data.user, like_data.message );
};

var _onReceiveOrder = function( order ){
	PlayerServerActionCreator.receiveSetOrder( order );
};

TandemSocketConnection.on( 'player:state', _onReceiveState );
TandemSocketConnection.on( 'player:play', _onReceivePlay );
TandemSocketConnection.on( 'player:elapsed', _onReceiveElapsedTime );
TandemSocketConnection.on( 'player:skip', _onReceiveSkip );
TandemSocketConnection.on( 'player:like', _onReceiveLike );
TandemSocketConnection.on( 'player:order', _onReceiveOrder );

var TandemPlayerSocketUtils = {
	setOrder: function( order ){
		TandemSocketConnection.emit( 'player:order', order );
	},
	skipItem: function(){
		TandemSocketConnection.emit( 'player:skip' );
	},
	likeItem: function(){
		TandemSocketConnection.emit( 'player:like' );
	}
};

module.exports = TandemPlayerSocketUtils;