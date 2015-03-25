var EventEmitter = require('events').EventEmitter;
var uuid = require('node-uuid');
var assign = require('lodash/object/assign');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _messages = [];

var _addMessage = function( message ){
	// Group many chat messages from one user into one message
	var top_message = _messages[0];
	if( top_message && top_message.type === 'chat' && message.type === 'chat' && top_message.user.id === message.user.id ){
		top_message.content = top_message.content.concat( message.content );
		top_message.time = new Date();
		return;
	}
	// Mixin a UUID to maintain uniqueness in React
	message.time = new Date();
	message.uuid = uuid.v1();
	_messages.unshift( message );
};

var ChatStore = assign( {}, EventEmitter.prototype, {
	getMessages: function( limit ){
		var messages = ( limit && limit < _messages.length )
			? _messages.slice( 0, limit )
			: _messages;
		return messages;
	}
});

ChatStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.CHAT_RECEIVE_ADD_MESSAGE:
			action.message.content = [action.message.content];
			_addMessage( action.message );
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.CHAT_RECEIVE_ADD_EMOTE:
			_addMessage( action.message );
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.ROOM_RECEIVE_SET_TITLE:
			_addMessage({
				type: 'title',
				user: action.user,
				title: action.title
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYER_RECEIVE_LIKE_ITEM:
			_addMessage({
				type: 'like',
				user: action.user,
				content: action.like_message
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYER_RECEIVE_ITEM:
			_addMessage({
				type: 'play',
				item: action.item
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYER_RECEIVE_SKIP_ITEM:
			_addMessage({
				type: 'skip',
				user: action.user,
				item: action.item
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.PLAYLIST_RECEIVE_REMOVE_ITEM:
			if( action.user ){
				_addMessage({
					type: 'remove',
					user: action.user,
					item: action.item
				});
				ChatStore.emit( CHANGE_EVENT );
			}
		break;
		case ActionTypes.PLAYLIST_RECEIVE_SORT_END:
			_addMessage({
				type: 'sort',
				origin: action.origin,
				destination: action.destination,
				user: action.user,
				item: action.item
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.USERS_RECEIVE_JOIN:
			_addMessage({
				type: 'join',
				user: action.user
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.USERS_RECEIVE_LEAVE:
			_addMessage({
				type: 'leave',
				user: action.user
			});
			ChatStore.emit( CHANGE_EVENT );
		break;
	}
});

module.exports = ChatStore;