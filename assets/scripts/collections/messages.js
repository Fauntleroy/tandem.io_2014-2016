var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		this.mediator = config.mediator;
		this.stream = config.stream;
		this.stream.on( 'data', this.processStream );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		console.log( data );
	}
})