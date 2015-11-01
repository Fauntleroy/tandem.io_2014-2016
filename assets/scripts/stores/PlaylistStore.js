import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';
import reject from 'lodash/collection/reject';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var CHANGE_EVENT = 'change';

var _is_remote_sorting = false;
var _is_adding = false;
var _items = [];

var _move = function( array, origin, destination ){
	var moving_item = array.splice( origin, 1 )[0];
	array.splice( destination, 0, moving_item );
};

var _removeItem = function( item_id ){
	var items = reject( _items, function( item ){
		return item.id === item_id;
	});
	return items;
};

var PlaylistStore = assign( {}, EventEmitter.prototype, {
	getIsRemoteSorting: function(){
		return _is_remote_sorting;
	},
	getIsAdding: function(){
		return _is_adding;
	},
	getItems: function(){
		return _items;
	}
});

PlaylistStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.PLAYLIST_ADD_ITEM_FROM_URL:
			_is_adding = true;
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_SORT_END:
			_move( _items, action.origin, action.destination );
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_ADD_ITEM_FROM_URL:
			_is_adding = false;
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_STATE:
			_items = action.state;
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_ADD_ITEM:
			_items.push( action.item );
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_REMOVE_ITEM:
			_items = _removeItem( action.item.id );
			PlaylistStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_SORT_START:
			if( action.user.id !== tandem.bridge.user.id ){
				_is_remote_sorting = true;
				PlaylistStore.emit( CHANGE_EVENT );
			}
		break;
		case ActionTypes.PLAYLIST_RECEIVE_SORT_END:
			if( action.user.id !== tandem.bridge.user.id ){
				_is_remote_sorting = false;
				_move( _items, action.origin, action.destination );
				PlaylistStore.emit( CHANGE_EVENT );
			}
		break;
	}
});

export default PlaylistStore;
