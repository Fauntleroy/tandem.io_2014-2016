var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _title = tandem.bridge.room.name;

var RoomStore = assign( {}, EventEmitter.prototype, {
	getTitle: function(){
		return _title;
	}
});

RoomStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.ROOM_RECEIVE_SET_TITLE:
			_title = action.title;
			RoomStore.emit( CHANGE_EVENT );
		break;
	}
});

module.exports = RoomStore;