import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

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

export default RoomStore;
