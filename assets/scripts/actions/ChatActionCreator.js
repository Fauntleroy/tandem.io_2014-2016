import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import TandemChatSocketUtils from '../utils/TandemChatSocketUtils.js';
import { ActionTypes } from '../constants/TandemConstants.js';

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

export default ChatActionCreator;
