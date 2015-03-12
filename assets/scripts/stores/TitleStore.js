var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');
var Visibility = require('visibilityjs/lib/visibility.core');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _room_title = document.title;
var _unread_messages = 0;
var _playing_item_title;

// TODO This should likely be moved elsewhere
// All these things should come through the dispatcher
var _setVisibility = function( event, state ){
	if( state === 'visible' ){
		_unread_messages = 0;
		TitleStore.emit( CHANGE_EVENT );
	}
};

Visibility.change( _setVisibility );

var TitleStore = assign( {}, EventEmitter.prototype, {
	getTitle: function(){
		var title = '';
		if( _unread_messages ){
			title += '('+ _unread_messages +') ';
		}
		title += _playing_item_title || _room_title;
		return title;
	}
});
	
TitleStore.dispatchToken = TandemDispatcher.register( function( payload ){
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
	}
});

module.exports = TitleStore;