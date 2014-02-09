var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	url: '/api/v1/rooms/',
	initialize: function( models, options ){
		this.mediator = options.mediator; // inherit mediator
		this.listenTo( this.mediator, 'rooms:list', this.fetch );
	}
});