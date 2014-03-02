var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var io = require('socket.io-client');

// Models & Collections
var Messages = require('./collections/messages.js');
var Users = require('./collections/users.js');
var PlaylistItems = require('./collections/playlist_items.js');
var Player = require('./models/player.js');
var Title = require('./models/title.js');
var SearchResults = require('./collections/search_results.js');

// Views
var ChatView = require('./views/chat.js');
var UsersView = require('./views/users.js');
var PlaylistView = require('./views/playlist.js');
var PlayerView = require('./views/player.js');
var TitleView = require('./views/title.js');
var SearchView = require('./views/search.js');

window.tandem = window.tandem || {};
var mediator = tandem.mediator = _.extend( {}, Backbone.Events );

// initialize room socket
var socket = io.connect( '/rooms/'+ tandem.bridge.room.id );

// authenticate user with streaming endpoint
socket.on( 'connect', function(){
	socket.emit( 'auth', {
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		token: tandem.bridge.user.token
	});
});

tandem.messages = new Messages( null, {
	mediator: mediator,
	socket: socket
});
tandem.users = new Users( null, {
	mediator: mediator,
	socket: socket
});
tandem.playlist_items = new PlaylistItems( null, {
	mediator: mediator,
	socket: socket
});
tandem.player = new Player( null, {
	mediator: mediator,
	socket: socket
});
tandem.title = new Title( null, {
	mediator: mediator,
	socket: socket
});
tandem.search_results = new SearchResults( null, {
	mediator: mediator
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
		}),
		search: new SearchView({
			el: '#search',
			collection: tandem.search_results
		})
	};
});