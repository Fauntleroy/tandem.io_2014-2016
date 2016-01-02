import React from'react';
import ReactDOM from'react-dom';
import domready from'domready';

// React Components
import UserMenu from'./components/UserMenu.jsx';
import Search from'./components/Search.jsx';
import RoomTitle from'./components/RoomTitle.jsx';
import Users from'./components/Users.jsx';
import Chat from'./components/Chat.jsx';
import Player from'./components/Player.jsx';
import Playlist from'./components/Playlist.jsx';

// Other Components
import Title from './components/Title.js';

window.tandem = window.tandem || {};

// Wait for DOM so views will work
domready( () => {
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
