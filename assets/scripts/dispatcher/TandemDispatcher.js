import { Dispatcher } from 'flux';
import assign from 'lodash/object/assign';

import { PayloadSources } from '../constants/TandemConstants.js';

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

export default TandemDispatcher;
