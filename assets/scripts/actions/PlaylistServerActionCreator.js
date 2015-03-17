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
	},
	receiveSortStart: function( user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.PLAYLIST_RECEIVE_SORT_START,
			user: user
		});
	},
	receiveSortEnd: function( origin, destination, item, user ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.PLAYLIST_RECEIVE_SORT_END,
			origin: origin,
			destination: destination,
			item: item,
			user: user
		});
	}
};

module.exports = PlaylistServerActionCreator;