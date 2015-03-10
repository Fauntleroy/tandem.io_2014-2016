var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

var action_creators = {
	receiveResults: function( results, source ){
		TandemDispatcher.handleServerAction({
			type: ActionTypes.SEARCH_RECEIVE_RESULTS,
			results: results,
			source: source
		});
	}
};

module.exports = action_creators;