var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/object/assign');
var find = require('lodash/collection/find');

var TandemDispatcher = require('../dispatcher/TandemDispatcher.js');
var TandemConstants = require('../constants/TandemConstants.js');
var ActionTypes = TandemConstants.ActionTypes;

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
	souncloud: []
};

var SearchResultsStore = assign( {}, EventEmitter.prototype, {
	getActive: function(){
		return _active;
	},
	getQuery: function(){
		return _query;
	},
	getActiveSource: function(){
		var active_source = find( _sources, function( source ){
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

SearchResultsStore.dispatchToken = TandemDispatcher.register( function( payload ){
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
			_sources = _sources.map( function( source ){
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

module.exports = SearchResultsStore;