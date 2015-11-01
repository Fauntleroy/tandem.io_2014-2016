import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var SearchServerActionCreator = {
	receiveResults: function( results, source ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.SEARCH_RECEIVE_RESULTS,
			results: results,
			source: source
		});
	}
};

export default SearchServerActionCreator;
