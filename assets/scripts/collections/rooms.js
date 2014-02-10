var Backbone = require('backbone');

var Room = require('../models/room.js');

module.exports = Backbone.Collection.extend({
	model: Room,
	url: '/api/v1/rooms/',
	initialize: function( models, options ){
		this.mediator = options.mediator; // inherit mediator
		this.listenTo( this.mediator, 'rooms:list', this.fetch );
	}
});