var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var engine = require('engine.io-stream');
var es = require('event-stream');

// Models & Collections
var Messages = require('./collections/messages.js');
var Users = require('./collections/users.js');
var PlaylistItems = require('./collections/playlist_items.js');
var Player = require('./models/player.js');
var Title = require('./models/title.js');

// Views
var ChatView = require('./views/chat.js');
var UsersView = require('./views/users.js');
var PlaylistView = require('./views/playlist.js');
var PlayerView = require('./views/player.js');
var TitleView = require('./views/title.js');

window.tandem = window.tandem || {};
var mediator = tandem.mediator = _.extend( {}, Backbone.Events );

// initialize room stream
var stream = engine('/streaming/rooms/'+ tandem.bridge.room.id );
var stringify_stream = es.stringify();
stringify_stream.pipe( stream );
tandem.stream = stream = es.duplex( stringify_stream, stream.pipe( es.parse() ) );
stream.on('data',function( data ){ console.log( 'data', data ); });

// authenticate user with streaming endpoint
stream.write({
	type: 'auth',
	payload: {
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		token: tandem.bridge.user.token
	}
});

tandem.messages = new Messages( null, {
	mediator: mediator,
	stream: stream
});
tandem.users = new Users( null, {
	mediator: mediator,
	stream: stream
});
tandem.playlist_items = new PlaylistItems( null, {
	mediator: mediator,
	stream: stream
});
tandem.player = new Player( null, {
	mediator: mediator,
	stream: stream
});
tandem.title = new Title( null, {
	mediator: mediator,
	stream: stream
});

// Wait for DOM so views will work
$( function(){
	tandem.views = {
		chat: new ChatView({
			el: '#chat',
			collection: tandem.messages
		}),
		users: new UsersView({
			el: '#users',
			collection: tandem.users
		}),
		playlist: new PlaylistView({
			el: '#playlist',
			collection: tandem.playlist_items
		}),
		player: new PlayerView({
			el: '#player',
			model: tandem.player
		}),
		title: new TitleView({
			model: tandem.title
		})
	};
});