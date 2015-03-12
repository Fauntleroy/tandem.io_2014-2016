var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var PlaylistServerActionCreator = {
	receiveState: function( state ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.PLAYLIST_RECEIVE_STATE,
			state: state
		});
	},
	receiveAddItem: function( item ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.PLAYLIST_RECEIVE_ADD_ITEM,
			item: item
		});
	},
	receiveRemoveItem: function( item ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.PLAYLIST_RECEIVE_REMOVE_ITEM,
			item: item
		});
	}
};

module.exports = PlaylistServerActionCreator;