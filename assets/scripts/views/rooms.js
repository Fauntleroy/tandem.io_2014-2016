var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var handlebars = require('handlebars');

var rooms_template = require('../../compiled/templates/rooms.js')( handlebars );

module.exports = Backbone.View.extend({
	template: rooms_template,
	initialize: function(){
		this.listenTo( this.collection, 'sync', this.render );
		this.render();
	},
	render: function(){
		var data = this.collection.toJSON();
		var markup = this.template( data );
		this.$el.html( markup );
	}
});