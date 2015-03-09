var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

// Models & Collections
var Messages = require('./collections/messages.js');
var Title = require('./models/title.js');

// Views
var ChatView = require('./views/chat.js');
var TitleView = require('./views/title.js');

// Reach Components
var Search = require('./components/Search.jsx');
var Users = require('./components/Users.jsx');
var Player = require('./components/Player.jsx');
var Playlist = require('./components/Playlist.jsx');

window.tandem = window.tandem || {};
var mediator = tandem.mediator = _.extend( {}, Backbone.Events );

// initialize room socket
var socket = require('./utils/_TandemSocketConnection.js');

tandem.messages = new Messages( null, {
	mediator: mediator,
	socket: socket,
	user: tandem.bridge.user
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
		title: new TitleView({
			model: tandem.title
		})
	};
	tandem.searchComponent = React.render( <Search mediator={mediator} />, document.getElementById('search') );
	tandem.usersComponent = React.render( <Users />, document.getElementById('users') );
	tandem.playerComponent = React.render( <Player />, document.getElementById('player') );
	tandem.playlistComponent = React.render( <Playlist />, document.getElementById('playlist') );
});
