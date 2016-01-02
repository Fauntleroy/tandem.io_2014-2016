import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';
import filter from 'lodash/collection/filter';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var CHANGE_EVENT = 'change';

var _users = [];

var UsersStore = assign( {}, EventEmitter.prototype, {
	getUsers: function(){
		return _users;
	}
});

UsersStore.dispatchToken = TandemDispatcher.register( payload => {
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
		_users = filter( _users, user => user.id !== action.user.id );
		UsersStore.emit( CHANGE_EVENT );
		break;
	}
});

export default UsersStore;
