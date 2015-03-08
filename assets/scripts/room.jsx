var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var io = require('socket.io-client');

// Models & Collections
var Messages = require('./collections/messages.js');
var Users = require('./collections/users.js');
var PlaylistItems = require('./collections/playlist_items.js');
var Title = require('./models/title.js');

// Views
var ChatView = require('./views/chat.js');
var UsersView = require('./views/users.js');
var PlaylistView = require('./views/playlist.js');
var TitleView = require('./views/title.js');

// Reach Components
var Search = require('./components/Search.jsx');
var Player = require('./components/Player.jsx');

window.tandem = window.tandem || {};
var mediator = tandem.mediator = _.extend( {}, Backbone.Events );

// initialize room socket
var socket = io.connect( '/rooms/'+ tandem.bridge.room.id, {
	query: 'token='+ tandem.bridge.user.token
		+'&id='+ encodeURIComponent( tandem.bridge.user.id )
		+'&name='+ encodeURIComponent( tandem.bridge.user.name )
		+'&avatar='+ encodeURIComponent( tandem.bridge.user.avatar )
});

tandem.messages = new Messages( null, {
	mediator: mediator,
	socket: socket,
	user: tandem.bridge.user
});
tandem.users = new Users( null, {
	mediator: mediator,
	socket: socket,
	user: tandem.bridge.user
});
tandem.playlist_items = new PlaylistItems( null, {
	mediator: mediator,
	socket: socket
});
tandem.title = new Title( null, {
	mediator: mediator,
	socket: socket
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
		title: new TitleView({
			model: tandem.title
		})
	};
	tandem.searchComponent = React.render( <Search mediator={mediator} />, document.getElementById('search') );
	tandem.playerComponent = React.render( <Player />, document.getElementById('player') );
});
