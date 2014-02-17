var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');

var chat_template = require('../../templates/chat.hbs');
var message_template = require('../../templates/message.hbs');

module.exports = Backbone.View.extend({
	template: chat_template,
	message_template: message_template,
	initialize: function(){
		this.render();
		this.listenTo( this.collection, 'add', this.addMessage );
	},
	render: function(){
		this.$el.html( this.template() );
		this.$messages = this.$el.find('.messages');
	},
	addMessage: function( message ){
		this.$messages.prepend( this.message_template( message.toJSON() ) );
	}
})