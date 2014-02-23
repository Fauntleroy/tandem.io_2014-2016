var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var _ = require('underscore');
var Handlebars = require('hbsfy/runtime');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );
var secondsToTime = require('../utils/secondsToTime.js');
Handlebars.registerHelper( 'secondsToTime', secondsToTime );

var playlist_template = require('../../templates/playlist.hbs');
var playlist_item_template = require('../../templates/playlist_item.hbs');

module.exports = Backbone.View.extend({
	events: {
		'submit form': 'submitUrl',
		'keypress :input[name="url"]': 'keyUrl',
		'click ul.items a.remove': 'clickRemove'
	},
	initialize: function(){
		_( this ).bindAll( 'destroy', 'render',
			'renderItems', 'renderItem', 'renderDuration', 'removeItem',
			'keyUrl', 'submitUrl', 'clickRemove' );
		this.render();
		this.listenTo( this.collection, 'reset', this.renderItems );
		this.listenTo( this.collection, 'add', this.renderItem );
		this.listenTo( this.collection, 'remove', this.removeItem );
		this.listenTo( this.collection, 'reset add remove', this.renderDuration );
	},
	// completely un-initializes the view
	destroy: function(){
		this.remove();
	},
	render: function(){
		this.$el.html( playlist_template() );
		this.$form = this.$('form');
		this.$url = this.$form.find('input[name="url"]');
		this.$duration = this.$('var.duration');
		this.$items = this.$('ul.items');
	},
	// render all playlist items
	renderItems: function( collection ){
		var items_markup = this.collection.reduce( function( memo, item ){
			return memo + playlist_item_template( item.toJSON() );
		}, '' );
		this.$items.html( items_markup );
	},
	// render and add a message to the messages ul
	renderItem: function( item ){
		this.$items.append( playlist_item_template( item.toJSON() ) );
	},
	// render total duration of playlist
	renderDuration: function(){
		var duration = this.collection.reduce( function( memo, playlist_item ){
			return memo + playlist_item.get('duration');
		}, 0 );
		this.$duration.text( secondsToTime( duration ) );
	},
	// remove an item from the items ul
	removeItem: function( item ){
		this.$items.find('li[data-id="'+ item.id +'"]').remove();
	},
	// watch for certain key events in the url input
	keyUrl: function( e ){
		if( e.which === 13 ){
			e.preventDefault();
			this.$form.trigger('submit');
		}
	},
	// submit a new url for processing/addition
	submitUrl: function( e ){
		e.preventDefault();
		var url = this.$url.val();
		if( !url ) return false;
		this.collection.addItem( url, function( err ){
			if( err ) return alert( err );
		});
		this.$url.val('');
	},
	// remove item when remove button is clicked
	clickRemove: function( e ){
		e.preventDefault();
		var $target = $(e.currentTarget);
		var $item = $target.closest('li');
		var id = $item.data('id');
		this.collection.sendRemove( id, function( err ){
			if( err ) return alert( err );
		});
	}
})