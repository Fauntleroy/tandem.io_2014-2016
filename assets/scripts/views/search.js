var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var _ = require('underscore');
var Handlebars = require('hbsfy/runtime');
var secondsToTime = require('../utils/secondsToTime.js');
Handlebars.registerHelper( 'secondsToTime', secondsToTime );

var search_template = require('../../templates/search.hbs');
var result_template = require('../../templates/search_result.hbs');

module.exports = Backbone.View.extend({
	events: {
		'submit form': 'search',
		'keypress :input[name="query"]': 'keyQuery',
		'click button.add': 'clickAdd',
		'click a.hide': 'hide',
		'click ul.providers a': 'clickProvider'
	},
	initialize: function(){
		_( this ).bindAll( 'renderResults', 'renderProvider', 'search', 'clickAdd', 'scrollResults', 'show', 'hide', 'keyQuery' );
		this.listenTo( this.collection, 'reset', this.renderResults );
		this.listenTo( this.collection, 'provider', this.renderProvider );
		this.render();
	},
	render: function(){
		this.$el.html( search_template() );
		this.$form = this.$('form');
		this.$query = this.$form.find(':input[name="query"]');
		this.$results = this.$('ul.results');
		this.$providers = this.$('ul.providers');
		this.hide();
		this.$results.on( 'mousewheel', this.scrollResults );
	},
	renderResults: function(){
		var results_str = this.collection.reduce( function( memo, result ){
			return memo + result_template( result.toJSON() );
		}, '' );
		this.$query.val( this.collection.query );
		this.$results
			.html( results_str )
			.animate({
				scrollTop: 0
			}, 350 );
		this.show();
	},
	// update active provider tab
	renderProvider: function( provider ){
		this.$providers.children( '.'+ provider ).addClass('active')
			.siblings().removeClass('active');
	},
	// search based on data in $query
	search: function( e ){
		e.preventDefault();
		var query = this.$query.val();
		if( query ) this.collection.search( query );
	},
	// show the search dialog
	show: function( e ){
		if( e instanceof $.Event ) e.preventDefault();
		this.$el.show();
	},
	// hide the search dialog
	hide: function( e ){
		if( e instanceof $.Event ) e.preventDefault();
		this.$el.hide();
	},
	// add a result to the playlist
	clickAdd: function( e ){
		e.preventDefault();
		var $button = $( e.target );
		var url = $button.attr('value');
		this.collection.addResult( url );
	},
	// trigger form submission
	keyQuery: function( e ){
		if( e.which === 13 ){
			e.preventDefault();
			this.$form.trigger('submit');
		}
	},
	// switch the active provider
	clickProvider: function( e ){
		e.preventDefault();
		var $target = $(e.target);
		var provider = $target.attr('href').replace( /^#/, '' );
		this.collection.setProvider( provider );
	},
	// prevent scroll from propagating to window
	scrollResults: function( e ){
		var delta = e.originalEvent.wheelDelta;
		if( !delta ) return;
		var scroll_top = this.$results[0].scrollTop;
		var outer_height = this.$results.outerHeight();
		var scroll_bottom = scroll_top + outer_height;
		var scroll_height = this.$results[0].scrollHeight;
		if( ( scroll_bottom >= scroll_height && delta < 0 ) || ( scroll_top === 0 && delta > 0 ) ){
			e.preventDefault();
		}
	}
});