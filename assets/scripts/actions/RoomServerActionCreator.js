import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var RoomServerActionCreator = {
	receiveSetTitle: function( title, user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.ROOM_RECEIVE_SET_TITLE,
			title: title,
			user: user
		});
	}
};

export default RoomServerActionCreator;
