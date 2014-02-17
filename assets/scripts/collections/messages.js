var es = require('event-stream');
var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
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
	}
})