var React = require('react');
var $ = require('jquery');

// React Components
var Search = require('./components/Search.jsx');
var Users = require('./components/Users.jsx');
var Chat = require('./components/Chat.jsx');
var Player = require('./components/Player.jsx');
var Playlist = require('./components/Playlist.jsx');

// Other Components
var Title = require('./components/Title.js');

window.tandem = window.tandem || {};

// Wait for DOM so views will work
$( function(){
	tandem.titleComponent = new Title();
	tandem.searchComponent = React.render( <Search />, document.getElementById('search') );
	tandem.usersComponent = React.render( <Users />, document.getElementById('users') );
	tandem.chatComponent = React.render( <Chat />, document.getElementById('chat') );
	tandem.playerComponent = React.render( <Player />, document.getElementById('player') );
	tandem.playlistComponent = React.render( <Playlist />, document.getElementById('playlist') );
});
