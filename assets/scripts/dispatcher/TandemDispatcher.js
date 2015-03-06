var Dispatcher = require('flux').Dispatcher;
var assign = require('lodash/object/assign');

var TandemConstants = require('../constants/TandemConstants.js');
var PayloadSources = TandemConstants.PayloadSources;

var TandemDispatcher = assign( new Dispatcher(), {
	handleServerAction: function( action ){
		var payload = {
			source: PayloadSources.SERVER_ACTION,
			action: action
		};
		this.dispatch( payload );
	},
	handleViewAction: function( action ){
		var payload = {
			source: PayloadSources.VIEW_ACTION,
			action: action
		};
		this.dispatch( payload );
	}
});

module.exports = TandemDispatcher;