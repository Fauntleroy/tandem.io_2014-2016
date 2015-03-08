var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemSocketUtils = require('../utils/TandemSocketUtils.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var action_creators = {
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
		TandemSocketUtils.setOrder( order );
	},
	skipItem: function(){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_SKIP_ITEM
		});
		TandemSocketUtils.skipItem();
	},
	likeItem: function(){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.PLAYER_LIKE_ITEM
		});
		TandemSocketUtils.likeItem();
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

module.exports = action_creators;