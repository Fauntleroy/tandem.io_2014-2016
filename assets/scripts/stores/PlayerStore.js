import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';
import store from 'store';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

const CHANGE_EVENT = 'change';
const CHANGE_ELAPSED_TIME_EVENT = 'change:elapsed_time';
const CHANGE_ITEM_EVENT = 'change:item';
const CHANGE_MUTE_EVENT = 'change:mute';
const CHANGE_VOLUME_EVENT = 'change:volume';
const VOLUME_KEY = 'tandem_volume';
const MUTE_KEY = 'tandem_mute';
const DEFAULT_VOLUME = 85;

var _item;
var _likers = [];
var _elapsed_time = 0;
var _client_elapsed_time = 0;
var _orders = ['fifo','shuffle'];
var _order = _orders[0];
if( typeof store.get( VOLUME_KEY ) === 'undefined' ){
	store.set( VOLUME_KEY, DEFAULT_VOLUME );
}
if( typeof store.get( MUTE_KEY ) === 'undefined' ){
	store.set( MUTE_KEY, false );
}

var PlayerStore = assign( {}, EventEmitter.prototype, {
	getItem: function(){
		return _item;
	},
	getLikers: function(){
		return _likers;
	},
	getClientElapsedTime: function(){
		return _client_elapsed_time;
	},
	getElapsedTime: function(){
		return _elapsed_time;
	},
	getOrder: function(){
		return _order;
	},
	getVolume: function(){
		return store.get( VOLUME_KEY );
	},
	getMute: function(){
		return store.get( MUTE_KEY );
	}
});

PlayerStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
	case ActionTypes.PLAYER_SET_ELAPSED_TIME:
		_client_elapsed_time = action.elapsed_time;
		PlayerStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.PLAYER_SET_VOLUME:
		store.set( VOLUME_KEY, action.volume );
		PlayerStore.emit( CHANGE_EVENT );
		PlayerStore.emit( CHANGE_VOLUME_EVENT );
		break;
	case ActionTypes.PLAYER_SET_MUTE:
		store.set( MUTE_KEY, action.toggle );
		PlayerStore.emit( CHANGE_EVENT );
		PlayerStore.emit( CHANGE_MUTE_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_STATE:
		_item = action.state.item;
		_likers = action.state.likers;
		_elapsed_time = action.state.elapsed;
		_order = action.state.order;
		PlayerStore.emit( CHANGE_EVENT );
		PlayerStore.emit( CHANGE_ITEM_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_ITEM:
		_item = action.item;
		_likers = [];
		_elapsed_time = 0;
		PlayerStore.emit( CHANGE_EVENT );
		PlayerStore.emit( CHANGE_ITEM_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_ELAPSED_TIME:
		_elapsed_time = action.elapsed_time;
		PlayerStore.emit( CHANGE_EVENT );
		PlayerStore.emit( CHANGE_ELAPSED_TIME_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_LIKE_ITEM:
		_likers = action.likers;
		PlayerStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_ORDER:
		_order = action.order;
		PlayerStore.emit( CHANGE_EVENT );
		break;
	}
});

export default PlayerStore;
