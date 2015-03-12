var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');
var filter = require('lodash/collection/filter');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var CHANGE_EVENT = 'change';

var _users = [];

var UsersStore = assign( {}, EventEmitter.prototype, {
	getUsers: function(){
		return _users;
	}
});

UsersStore.dispatchToken = TandemDispatcher.register( function( payload ){
	var action = payload.action;
	switch( action.type ){
		case ActionTypes.USERS_RECEIVE_STATE:
			_users = action.state;
			UsersStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.USERS_RECEIVE_JOIN:
			_users.push( action.user );
			UsersStore.emit( CHANGE_EVENT );
		break;
		case ActionTypes.USERS_RECEIVE_LEAVE:
			_users = filter( _users, function( user ){
				return user.id !== action.user.id;
			});
			UsersStore.emit( CHANGE_EVENT );
		break;
	}
});

module.exports = UsersStore;