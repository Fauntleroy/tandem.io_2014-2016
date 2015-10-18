var React = require('react');
var ReactDOM = require('react-dom');
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
		user_menu: ReactDOM.render( <UserMenu />, document.getElementById('user-menu') ),
		search: ReactDOM.render( <Search />, document.getElementById('search') ),
		room_title: ReactDOM.render( <RoomTitle />, document.getElementById('title') ),
		users: ReactDOM.render( <Users />, document.getElementById('users') ),
		chat: ReactDOM.render( <Chat />, document.getElementById('chat') ),
		player: ReactDOM.render( <Player />, document.getElementById('player') ),
		playlist: ReactDOM.render( <Playlist />, document.getElementById('playlist') )
	};
});
