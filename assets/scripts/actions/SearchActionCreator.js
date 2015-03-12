var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var YoutubeAPIUtils = require('../utils/YoutubeAPIUtils.js');
var SoundcloudAPIUtils = require('../utils/SoundcloudAPIUtils.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;
var SearchResultsStore = require('../stores/SearchResultsStore.js');

var action_creators = {
	toggleActive: function( toggle ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.SEARCH_ACTIVE,
			toggle: toggle
		});
	},
	startSearch: function( query ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.SEARCH_START,
			query: query
		});
		var source = SearchResultsStore.getActiveSource();
		switch( source.name ){
			case 'youtube':
				YoutubeAPIUtils.startSearch( query );
			break;
			case 'soundcloud':
				SoundcloudAPIUtils.startSearch( query );
			break;
		}
	},
	switchSource: function( source ){
		TandemDispatcher.handleViewAction({
			type: ActionTypes.SEARCH_SWITCH_SOURCE,
			source: source
		});
	}
};

module.exports = action_creators;