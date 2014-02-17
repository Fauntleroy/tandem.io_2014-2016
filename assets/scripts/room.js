var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var engine = require('engine.io-stream');
var es = require('event-stream');

var Messages = require('./collections/messages.js');
var ChatView = require('./views/chat.js');

window.quicksync = window.quicksync || {};
var mediator = quicksync.mediator = _.extend( {}, Backbone.Events );

// initialize room stream
var stream = quicksync.stream = engine('/streaming/rooms/'+ quicksync.bridge.room.id );
var stringify_stream = es.stringify();
stringify_stream.pipe( stream );
stream = es.duplex( stringify_stream, stream.pipe( es.parse() ) );

// authenticate user with streaming endpoint
stream.write({
	type: 'auth',
	payload: {
		id: quicksync.bridge.user.id,
		name: quicksync.bridge.user.name,
		token: quicksync.bridge.user.token
	}
});

quicksync.messages = new Messages( null, {
	mediator: mediator,
	stream: stream
});

// Wait for DOM so views will work
$( function(){
	quicksync.views = {
		chat: new ChatView({
			el: '#chat',
			collection: quicksync.messages
		})
	};
});