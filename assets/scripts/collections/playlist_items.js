var NAMESPACE = 'playlist:';

var es = require('event-stream');
var _ = require('underscore');
var Backbone = require('backbone');

var adapters = require('../adapters');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		_( this ).bindAll( 'processStream', 'addItem' );
		this.mediator = config.mediator;
		var write_stream = es.through( this.preprocessStream );
		write_stream.pipe( config.stream );
		this.stream = es.duplex( write_stream, config.stream );
		this.stream.on( 'data', this.processStream );
		this.listenTo( this.mediator, 'search:add', this.addItem );
	},
	// Modify data object before sending to stream
	preprocessStream: function( data ){
		data.module = 'playlist';
		this.queue( data );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		if( data.module === 'playlist' ){
			switch( data.type ){
			case 'list':
				this.onList( data.payload );
			break;
			case 'add':
				this.onAdd( data.payload );
			break;
			case 'remove':
				this.onRemove( data.payload );
			break;
			}
		}
	},
	// add an item from a string
	addItem: function( url_or_query, callback ){
		callback = callback || function(){};
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
			});
		}.bind( this ));
	},
	sendAdd: function( item ){
		this.stream.write({
			type: 'add',
			payload: item
		});
	},
	sendRemove: function( id ){
		this.stream.write({
			type: 'remove',
			payload: id
		});
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