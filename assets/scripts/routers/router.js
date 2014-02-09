var Backbone = require('backbone');

module.exports = Backbone.Router.extend({
	routes: {
		'': 'index',
		'rooms/:id': 'room'
	},
	initialize: function( options ){
		this.mediator = options.mediator; // inherit mediator
	},
	index: function(){
		this.mediator.trigger('rooms:list');
	},
	room: function( id ){
		this.mediator.trigger( 'room:join', id );
	}
});