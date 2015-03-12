var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemPlaylistSocketUtils = require('../utils/TandemPlaylistSocketUtils.js');
var YoutubeAPIUtils = require('../utils/YoutubeAPIUtils.js');
var SoundcloudAPIUtils = require('../utils/SoundcloudAPIUtils.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var PlaylistActionCreator = {
	addItem: function( item ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_ADD_ITEM,
			item: item
		});
		TandemPlaylistSocketUtils.addItem( item );
	},
	addItemFromUrl: function( url, source ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_ADD_ITEM_FROM_URL,
			url: url,
			source: source
		});
		switch( source ){
			case 'youtube':
				YoutubeAPIUtils.getItemFromUrl( url, function( err, item ){
					PlaylistActionCreator.receiveAddItemFromUrl( err, item );
				});
			break;
			case 'soundcloud':
				SoundcloudAPIUtils.getItemFromUrl( url, function( err, item ){
					PlaylistActionCreator.receiveAddItemFromUrl( err, item );
				});
			break;
		}
	},
	// TODO Is this the right place to do this?
	receiveAddItemFromUrl: function( err, item ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_RECEIVE_ADD_ITEM_FROM_URL,
			err: err,
			item: item
		});
		if( err ){
			alert( err );
		}
		else {
			PlaylistActionCreator.addItem( item );
		}
	},
	removeItem: function( item_id ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_REMOVE_ITEM,
			item_id: item_id
		});
		TandemPlaylistSocketUtils.removeItem( item_id );
	}
};

module.exports = PlaylistActionCreator;