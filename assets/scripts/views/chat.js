var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var Handlebars = require('hbsfy/runtime');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );

var chat_template = require('../../templates/chat.hbs');
var message_template = require('../../templates/message.hbs');
var message_line_template = require('../../templates/message_line.hbs');

module.exports = Backbone.View.extend({
	events: {
		'submit form': 'submitMessage',
		'keypress textarea[name="message"]': 'keyMessage'
	},
	initialize: function(){
		this.render();
		this.listenTo( this.collection, 'add', this.addMessage );
	},
	render: function(){
		this.$el.html( chat_template() );
		this.$messages = this.$('.messages');
		this.$new_message = this.$('.new_message');
		this.$message = this.$('[name="message"]');
	},
	addMessage: function( message ){
		var $top_message = this.$messages.children(':first');
		var top_user_id = $top_message.find('span.user').data('user-id');
		var user = message.get('user') || {};
		// append this message to an existing message block
		if( top_user_id === user.id && $top_message.is('.chat') ){
			$top_message.find('.content').append( message_line_template( message.toJSON() ) );
		}
		// prepend a new message block
		else {
			this.$messages.prepend( message_template( message.toJSON() ) );
		}
	},
	// send a new message when the form is submitted and a message exists
	submitMessage: function( e ){
		e.preventDefault();
		var message = $.trim( this.$message.val() );
		if( message ){
			var emote_bits = /^\/me\s(.*)$/.exec( message );
			if( emote_bits ){
				this.collection.sendEmote( emote_bits[1] );
			}
			else {
				this.collection.sendMessage( message );
			}
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