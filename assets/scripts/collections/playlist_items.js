var es = require('event-stream');
var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		_( this ).bindAll( 'processStream' );
		this.mediator = config.mediator;
		var write_stream = es.through( this.preprocessStream );
		write_stream.pipe( config.stream );
		this.stream = es.duplex( write_stream, config.stream );
		this.stream.on( 'data', this.processStream );
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