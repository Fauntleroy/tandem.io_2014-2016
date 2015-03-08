var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

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

module.exports = UsersServerActionCreator;