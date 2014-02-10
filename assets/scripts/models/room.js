var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	initialize: function( attributes, options ){
		this.mediator = options.mediator; // inherit mediator
	}
})