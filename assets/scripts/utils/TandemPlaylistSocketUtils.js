import TandemSocketConnection from './_TandemSocketConnection.js';
import PlaylistServerActionCreator from '../actions/PlaylistServerActionCreator.js';

var _onReceiveState = function( state ){
	PlaylistServerActionCreator.receiveState( state );
};

var _onReceiveAddItem = function( item ){
	PlaylistServerActionCreator.receiveAddItem( item );
};

var _onReceiveRemoveItem = function( item, user ){
	PlaylistServerActionCreator.receiveRemoveItem( item, user );
};

var _onReceiveSortStart = function( user ){
	PlaylistServerActionCreator.receiveSortStart( user );
};

var _onReceiveSortEnd = function( origin, destination, item, user ){
	PlaylistServerActionCreator.receiveSortEnd( origin, destination, item, user );
};

TandemSocketConnection.on( 'playlist:list', _onReceiveState );
TandemSocketConnection.on( 'playlist:add', _onReceiveAddItem );
TandemSocketConnection.on( 'playlist:remove', _onReceiveRemoveItem );
TandemSocketConnection.on( 'playlist:sort:start', _onReceiveSortStart );
TandemSocketConnection.on( 'playlist:sort:end', _onReceiveSortEnd );

var TandemPlaylistSocketUtils = {
	addItem: function( item ){
		TandemSocketConnection.emit( 'playlist:add', item );
	},
	removeItem: function( item_id ){
		TandemSocketConnection.emit( 'playlist:remove', item_id );
	},
	sortStart: function(){
		TandemSocketConnection.emit('playlist:sort:start');
	},
	sortEnd: function( origin, destination ){
		TandemSocketConnection.emit( 'playlist:sort:end', origin, destination );
	}
};

export default TandemPlaylistSocketUtils;
