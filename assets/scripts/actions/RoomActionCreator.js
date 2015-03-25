var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemRoomSocketUtils = require('../utils/TandemRoomSocketUtils.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var RoomActionCreator = {
	setTitle: function( title ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.ROOM_SET_TITLE,
			title: title
		});
		TandemRoomSocketUtils.setTitle( title );
	}
};

module.exports = RoomActionCreator;