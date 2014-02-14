var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');

var chat_template = require('../../templates/chat.hbs');

module.exports = Backbone.View.extend({
	template: chat_template,
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html( this.template() );
	}
})