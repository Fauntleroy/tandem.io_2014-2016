var React = require('react');
var domready = require('domready');

// React Components
var UserMenu = require('./components/UserMenu.jsx');
var Search = require('./components/Search.jsx');
var RoomTitle = require('./components/RoomTitle.jsx');
var Users = require('./components/Users.jsx');
var Chat = require('./components/Chat.jsx');
var Player = require('./components/Player.jsx');
var Playlist = require('./components/Playlist.jsx');

// Other Components
var Title = require('./components/Title.js');

window.tandem = window.tandem || {};

// Wait for DOM so views will work
domready( function(){
	tandem.components = {
		title: new Title(),
		user_menu: React.render( <UserMenu />, document.getElementById('user-menu') ),
		search: React.render( <Search />, document.getElementById('search') ),
		room_title: React.render( <RoomTitle />, document.getElementById('title') ),
		users: React.render( <Users />, document.getElementById('users') ),
		chat: React.render( <Chat />, document.getElementById('chat') ),
		player: React.render( <Player />, document.getElementById('player') ),
		playlist: React.render( <Playlist />, document.getElementById('playlist') )
	};
});
