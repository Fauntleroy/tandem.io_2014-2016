var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
	initialize: function( attributes, options ){
		this.mediator = options.mediator; // inherit mediator
	}
})