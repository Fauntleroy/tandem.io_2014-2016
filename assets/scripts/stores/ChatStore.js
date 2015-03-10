var EventEmitter = require('events').EventEmitter;
var uuid = require('node-uuid');
var assign = require('lodash/object/assign');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _messages = [];

var _addMessage = function( message ){
	// Mixin a UUID to maintain uniqueness in React
	message.time = new Date();
	message.uuid = uuid.v1();
	_messages.unshift( message );
};

var ChatStore = assign( {}, EventEmitter.prototype, {
	getMessages: function(){
		return _messages;
	}
});

ChatStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.CHAT_RECEIVE_ADD_MESSAGE:
			_addMessage( action.message );
			ChatStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.CHAT_RECEIVE_ADD_EMOTE:
			_addMessage( action.message );
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