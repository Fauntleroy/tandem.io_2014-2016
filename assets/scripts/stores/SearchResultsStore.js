import { EventEmitter } from 'events';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';

import TandemDispatcher from '../dispatcher/TandemDispatcher.js';
import { ActionTypes } from '../constants/TandemConstants.js';

var CHANGE_EVENT = 'change';

var _active = false;
var _query;
var _sources = [{
	name: 'youtube',
	display_name: 'YouTube',
	active: true
}, {
	name: 'soundcloud',
	display_name: 'SoundCloud',
	active: false
}];
var _results = {
	youtube: [],
	soundcloud: []
};

var SearchResultsStore = assign( {}, EventEmitter.prototype, {
	getActive: function(){
		return _active;
	},
	getQuery: function(){
		return _query;
	},
	getActiveSource: function(){
		var active_source = find( _sources, source => {
			return source.active;
		});
		return active_source;
	},
	getSources: function(){
		return _sources;
	},
	getResultsBySource: function( source ){
		return _results[source];
	},
	getResultsFromActiveSource: function(){
		var active_source = this.getActiveSource();
		return this.getResultsBySource( active_source.name );
	}
});

SearchResultsStore.dispatchToken = TandemDispatcher.register( payload => {
	var action = payload.action;
	switch( action.type ){
	case ActionTypes.SEARCH_ACTIVE:
		_active = action.toggle;
		SearchResultsStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.SEARCH_START:
		_query = action.query;
		SearchResultsStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.SEARCH_SWITCH_SOURCE:
		_sources = _sources.map( source => {
			source.active = ( action.source === source.name );
			return source;
		});
		SearchResultsStore.emit( CHANGE_EVENT );
		break;
	case ActionTypes.SEARCH_RECEIVE_RESULTS:
		_results[action.source] = action.results;
		SearchResultsStore.emit( CHANGE_EVENT );
		break;
	}
});

export default SearchResultsStore;
