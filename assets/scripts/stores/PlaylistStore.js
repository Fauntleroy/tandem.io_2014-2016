var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');
var reject = require('lodash/collection/reject');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _items = [];

var _removeItem = function( item_id ){
	_items = reject( _items, function( item ){
		return item.id === item_id;
	});
};

var PlaylistStore = assign( {}, EventEmitter.prototype, {
	getItems: function(){
		return _items;
	}
});

PlaylistStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.PLAYLIST_RECEIVE_STATE:
			_items = action.state;
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_ADD_ITEM:
			_items.push( action.item );
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_REMOVE_ITEM:
			_removeItem( action.item.id );
			PlaylistStore.emit( CHANGE_EVENT );
		break;
	}
});

module.exports = PlaylistStore;