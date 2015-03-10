var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

// Models & Collections
var Title = require('./models/title.js');

// Views
var TitleView = require('./views/title.js');

// Reach Components
var Search = require('./components/Search.jsx');
var Users = require('./components/Users.jsx');
var Chat = require('./components/Chat.jsx');
var Player = require('./components/Player.jsx');
var Playlist = require('./components/Playlist.jsx');

window.tandem = window.tandem || {};
var mediator = tandem.mediator = _.extend( {}, Backbone.Events );

// initialize room socket
var socket = require('./utils/_TandemSocketConnection.js');

tandem.title = new Title( null, {
	mediator: mediator,
	socket: socket
});

// Wait for DOM so views will work
$( function(){
	tandem.views = {
		title: new TitleView({
			model: tandem.title
		})
	};
	tandem.searchComponent = React.render( <Search mediator={mediator} />, document.getElementById('search') );
	tandem.usersComponent = React.render( <Users />, document.getElementById('users') );
	tandem.chatComponent = React.render( <Chat />, document.getElementById('chat') );
	tandem.playerComponent = React.render( <Player />, document.getElementById('player') );
	tandem.playlistComponent = React.render( <Playlist />, document.getElementById('playlist') );
});
