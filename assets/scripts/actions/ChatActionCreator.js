var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemChatSocketUtils = require('../utils/TandemChatSocketUtils.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var ChatActionCreator = {
	addMessage: function( message ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.CHAT_ADD_MESSAGE,
			message: message
		});
		TandemChatSocketUtils.addMessage( message );
	},
	addEmote: function( message ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.CHAT_ADD_EMOTE,
			message: message
		});
		TandemChatSocketUtils.addEmote( message );
	}
};

module.exports = ChatActionCreator;