var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var ChatServerActionCreator = {
	receiveAddMessage: function( message ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.CHAT_RECEIVE_ADD_MESSAGE,
			message: message
		});
	},
	receiveAddEmote: function( message ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.CHAT_RECEIVE_ADD_EMOTE,
			message: message
		});
	}
};

module.exports = ChatServerActionCreator;