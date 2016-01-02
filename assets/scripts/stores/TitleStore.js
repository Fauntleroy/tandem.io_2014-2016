import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';
import Visibility from 'visibilityjs/lib/visibility.core';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var CHANGE_EVENT = 'change';

var _room_title = document.title;
var _unread_messages = 0;
var _playing_item_title;

var TitleStore = assign( {}, EventEmitter.prototype, {
	setRoomTitle: function( title ){
		_room_title = title;
	},
	setVisibility: function( event, state ){
		if( state === 'visible' ){
			_unread_messages = 0;
			TitleStore.emit( CHANGE_EVENT );
		}
	},
	getTitle: function(){
		var title = '';
		if( _unread_messages ){
			title += `(${_unread_messages}) `;
		}
		title += _playing_item_title || _room_title;
		return title;
	}
});

// TODO This should likely be moved elsewhere
// All these things should come through the dispatcher
Visibility.change( TitleStore.setVisibility );

TitleStore.dispatchToken = TandemDispatcher.register( payload => {
	var action = payload.action;
	switch( action.type ){
	case ActionTypes.PLAYER_RECEIVE_STATE:
		_playing_item_title = ( action.state.item )
			? action.state.item.title
			: null;
		TitleStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.PLAYER_RECEIVE_ITEM:
		_playing_item_title = ( action.item )
			? action.item.title
			: null;
		TitleStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.CHAT_RECEIVE_ADD_MESSAGE:
		if( Visibility.hidden() ){
			_unread_messages++;
			TitleStore.emit( CHANGE_EVENT );
		}
		break;
	case ActionTypes.CHAT_RECEIVE_ADD_EMOTE:
		if( Visibility.hidden() ){
			_unread_messages++;
			TitleStore.emit( CHANGE_EVENT );
		}
		break;
	case ActionTypes.ROOM_RECEIVE_SET_TITLE:
		TitleStore.setRoomTitle( action.title );
		TitleStore.emit( CHANGE_EVENT );
		break;
	}
});

export default TitleStore;
