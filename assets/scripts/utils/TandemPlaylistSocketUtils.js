var TandemSocketConnection = require('./_TandemSocketConnection.js');
var PlaylistServerActionCreator = require('../actions/PlaylistServerActionCreator.js');

var _onReceiveState = function( state ){
	PlaylistServerActionCreator.receiveState( state );
};

var _onReceiveAddItem = function( item ){
	PlaylistServerActionCreator.receiveAddItem( item );
};

var _onReceiveRemoveItem = function( item ){
	PlaylistServerActionCreator.receiveRemoveItem( item );
};

TandemSocketConnection.on( 'playlist:list', _onReceiveState );
TandemSocketConnection.on( 'playlist:add', _onReceiveAddItem );
TandemSocketConnection.on( 'playlist:remove', _onReceiveRemoveItem );

var TandemPlaylistSocketUtils = {
	addItem: function( item ){
		TandemSocketConnection.emit( 'playlist:add', item );
	},
	removeItem: function( item_id ){
		TandemSocketConnection.emit( 'playlist:remove', item_id );
	}
};

module.exports = TandemPlaylistSocketUtils;