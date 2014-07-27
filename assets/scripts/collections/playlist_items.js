var NAMESPACE = 'playlist:';
var NO_OP = function(){};

var _ = require('underscore');
var Backbone = require('backbone');

var adapters = require('../adapters');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		_.bindAll( this, 'addItem', 'sendAdd', 'onList', 'onAdd', 'onRemove' );
		this.mediator = config.mediator;
		this.socket = config.socket;
		this.listenTo( this.mediator, 'search:add', this.addItem );
		this.listenTo( this.socket, 'playlist:list', this.onList );
		this.listenTo( this.socket, 'playlist:add', this.onAdd );
		this.listenTo( this.socket, 'playlist:remove', this.onRemove );
	},
	// add an item from a string
	addItem: function( url_or_query, callback ){
		callback = callback || NO_OP;
		var is_youtube = /youtube\.com.*[\?&]v=(.{11})|youtu\.be\/(.{11})/i.test( url_or_query );
		var is_soundcloud = /.*soundcloud\.com\/.*/i.test( url_or_query );
		var is_vimeo = /vimeo\.com\/([0-9]*)/.test( url_or_query );
		var adapter;
		if( is_youtube ) adapter = adapters.youtube;
		if( is_soundcloud ) adapter = adapters.soundcloud;
		if( is_vimeo ) adapter = adapters.vimeo;
		if( !adapter ){
			this.mediator.trigger( NAMESPACE +'search', url_or_query );
			return callback( null );
		}
		adapter.getItem( url_or_query, function( err, item_data ){
			if( err ) return callback( err );
			this.sendAdd( item_data, function( err ){
				if( err ) return callback( err );
				return callback( null );
			});
		}.bind( this ));
	},
	sendAdd: function( item, callback ){
		callback = callback || NO_OP;
		this.socket.emit( 'playlist:add', item, function( err ){
			callback( err );
		});
	},
	sendRemove: function( id ){
		this.socket.emit( 'playlist:remove', id );
	},
	onList: function( playlist ){
		this.reset( playlist );
	},
	onAdd: function( item ){
		this.add( item );
	},
	onRemove: function( id ){
		this.remove( this.get( id ) );
	}
})