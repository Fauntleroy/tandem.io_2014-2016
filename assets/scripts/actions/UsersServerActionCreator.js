import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var UsersServerActionCreator = {
	receiveState: function( state ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.USERS_RECEIVE_STATE,
			state: state
		});
	},
	receiveJoin: function( user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.USERS_RECEIVE_JOIN,
			user: user
		});
	},
	receiveLeave: function( user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.USERS_RECEIVE_LEAVE,
			user: user
		});
	}
};

export default UsersServerActionCreator;
