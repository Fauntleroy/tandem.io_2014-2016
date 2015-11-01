import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import TandemPlayerSocketUtils from '../utils/TandemPlayerSocketUtils.js';
import YoutubeAPIUtils from '../utils/YoutubeAPIUtils.js';
import SoundcloudAPIUtils from '../utils/SoundcloudAPIUtils.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var PlayerActionCreator = {
	setElapsedTime: function( elapsed_time ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SET_ELAPSED_TIME,
			elapsed_time: elapsed_time
		});
	},
	setOrder: function( order ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SET_ORDER,
			order: order
		});
		TandemPlayerSocketUtils.setOrder( order );
	},
	skipItem: function(){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SKIP_ITEM
		});
		TandemPlayerSocketUtils.skipItem();
	},
	likeItem: function( item ){
		if( !item ){
			return;
		}
		var user = tandem.bridge.user;
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_LIKE_ITEM
		});
		TandemPlayerSocketUtils.likeItem();
		switch( item.source ){
			case 'youtube':
				if( user.is_youtube_linked && user.youtube_likes_id ){
					YoutubeAPIUtils.likeItem( item.original_id, user.youtube_likes_id );
				}
			break;
			case 'soundcloud':
				if( user.is_soundcloud_linked ){
					SoundcloudAPIUtils.likeItem( item.original_id );
				}
			break;
		}
	},
	mute: function( toggle ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SET_MUTE,
			toggle: toggle
		});
	},
	setVolume: function( volume ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SET_VOLUME,
			volume: volume
		});
	}
};

export default PlayerActionCreator;
