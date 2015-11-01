import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import TandemPlaylistSocketUtils from '../utils/TandemPlaylistSocketUtils.js';
import YoutubeAPIUtils from '../utils/YoutubeAPIUtils.js';
import SoundcloudAPIUtils from '../utils/SoundcloudAPIUtils.js';
import { ActionTypes } from '../constants/TandemConstants.js';

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
	},
	sortStart: function(){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_SORT_START
		});
		TandemPlaylistSocketUtils.sortStart();
	},
	sortEnd: function( origin, destination ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYLIST_SORT_END,
			origin: origin,
			destination: destination
		});
		TandemPlaylistSocketUtils.sortEnd( origin, destination );
	}
};

export default PlaylistActionCreator;
