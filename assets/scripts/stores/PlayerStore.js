var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';
var CHANGE_ELAPSED_TIME_EVENT = 'change:elapsed_time';
var CHANGE_ITEM_EVENT = 'change:item';
var CHANGE_MUTE_EVENT = 'change:mute';
var CHANGE_VOLUME_EVENT = 'change:volume';

var _item;
var _likers = [];
var _elapsed_time = 0;
var _client_elapsed_time = 0;
var _orders = ['fifo','shuffle'];
var _order = _orders[0];
var _volume = 85;
var _mute = false;

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
		return _volume;
	},
	getMute: function(){
		return _mute;
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
			_volume = action.volume;
			PlayerStore.emit( CHANGE_EVENT );
			PlayerStore.emit( CHANGE_VOLUME_EVENT );
		break;
		case ActionTypes.PLAYER_SET_MUTE:
			_mute = action.toggle;
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

module.exports = PlayerStore;