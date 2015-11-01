import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import YoutubeAPIUtils from '../utils/YoutubeAPIUtils.js';
import SoundcloudAPIUtils from '../utils/SoundcloudAPIUtils.js';
import { ActionTypes } from '../constants/TandemConstants.js';
import SearchResultsStore from '../stores/SearchResultsStore.js';

var SearchActionCreator = {
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

export default SearchActionCreator;
