import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

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

export default ChatServerActionCreator;
