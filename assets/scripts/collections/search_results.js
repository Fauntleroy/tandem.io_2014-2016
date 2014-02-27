var NAMESPACE = 'search:';

var Backbone = require('backbone');
var _ = require('underscore');
var Result = require('../models/search_result.js');
var adapters = require('../adapters');

module.exports = Backbone.Collection.extend({
	model: Result,
	initialize: function( models, config ){
		_.bindAll( this, 'destroy', 'search', 'addResult' );
		this.adapters = adapters; // expose for testing
		this.mediator = config.mediator;
		this.query = null;
		this.provider = 'youtube';
		this.listenTo( this.mediator, 'playlist:search', this.search );
	},
	destroy: function(){
		this.off();
	},
	// search for items based on query
	search: function( query ){
		var results = this;
		this.query = query;
		this.adapters[this.provider].search( query, null, function( err, search_results ){
			if( err ) return alert( err );
			results.reset( search_results );
		});
	},
	// add a result to the playlist
	addResult: function( url ){
		this.mediator.trigger( NAMESPACE +'add', url );
	},
	// change the search provider
	setProvider: function( provider ){
		if( this.provider === provider ) return false;
		this.provider = provider;
		this.trigger( 'provider', provider );
		this.search( this.query );
	}
});