var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var RoomServerActionCreator = {
	receiveSetTitle: function( title, user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.ROOM_RECEIVE_SET_TITLE,
			title: title,
			user: user
		});
	}
};

module.exports = RoomServerActionCreator;