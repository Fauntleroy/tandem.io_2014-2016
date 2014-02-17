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
		data.module = 'chat';
		this.queue( data );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		console.log( data );
		if( data.module === 'chat' ){
			switch( data.type ){
			case 'message':
				this.onMessage( data.payload );	
			break;
			}
		}
	},
	sendMessage: function( message ){
		this.stream.write({
			type: 'message',
			payload: {
				content: message
			}
		});
	},
	onMessage: function( message ){
		this.add( message );
	}
})