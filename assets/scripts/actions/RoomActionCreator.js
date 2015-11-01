import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import TandemRoomSocketUtils from '../utils/TandemRoomSocketUtils.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var RoomActionCreator = {
	setTitle: function( title ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.ROOM_SET_TITLE,
			title: title
		});
		TandemRoomSocketUtils.setTitle( title );
	}
};

export default RoomActionCreator;
