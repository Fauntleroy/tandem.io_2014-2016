var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var ChatView = require('./views/chat.js');

window.quicksync = window.quicksync || {};
var mediator = quicksync.mediator = _.extend( {}, Backbone.Events );

// Wait for DOM so views will work
$( function(){
	quicksync.views = {
		chat: new ChatView({
			el: '#chat'
		})
	};
});