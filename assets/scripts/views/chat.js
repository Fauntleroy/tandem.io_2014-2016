var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');

var chat_template = require('../../templates/chat.hbs');
var message_template = require('../../templates/message.hbs');

module.exports = Backbone.View.extend({
	template: chat_template,
	message_template: message_template,
	events: {
		'submit form': 'submitMessage',
		'keypress textarea[name="message"]': 'keyMessage'
	},
	initialize: function(){
		this.render();
		this.listenTo( this.collection, 'add', this.addMessage );
	},
	render: function(){
		this.$el.html( this.template() );
		this.$messages = this.$('.messages');
		this.$new_message = this.$('.new_message');
		this.$message = this.$('[name="message"]');
	},
	addMessage: function( message ){
		this.$messages.prepend( this.message_template( message.toJSON() ) );
	},
	// send a new message when the form is submitted and a message exists
	submitMessage: function( e ){
		e.preventDefault();
		var message = $.trim( this.$message.val() );
		if( message ){
			this.collection.sendMessage( message );
			this.$message.val('');
		}
	},
	// trigger form submit under the right conditions
	keyMessage: function( e ){
		if( e.which === 13 && !e.shiftKey ){
			e.preventDefault();
			this.$new_message.trigger('submit');
		}
	}
})