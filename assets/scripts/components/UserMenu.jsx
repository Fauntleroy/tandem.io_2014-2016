import React from 'react';

import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import User from './User.jsx';

var UserMenu = React.createClass({
	render: function(){
		var user = tandem.bridge.user;
		var register_youtube_jsx = ( user.is_youtube_linked )
			? <span className="user-menu__item__info">Logged in with Youtube <i className="fa fa-check" /></span>
			: <a className="user-menu__item__link" href="/auth/youtube">Log in with Youtube <i className="fa fa-youtube" /></a>;
		var register_soundcloud_jsx = ( user.is_soundcloud_linked )
			? <span className="user-menu__item__info">Logged in with Soundcloud <i className="fa fa-check" /></span>
			: <a className="user-menu__item__link" href="/auth/soundcloud">Log in with Soundcloud <i className="fa fa-soundcloud" /></a>;
		var logout_jsx = ( user.is_registered )
			? <li className="user-menu__item"><a className="user-menu__item__link" href="/logout">Log Out</a></li>
			: '';
		return (
			<Dropdown className="user-menu">
				<DropdownTrigger className="user-menu__trigger">
					<User user={user} />
					<i className="fa fa-caret-down" />
				</DropdownTrigger>
				<DropdownContent className="user-menu__content">
					<ul className="user-menu__items">
						<li className="user-menu__item">
							{register_youtube_jsx}
						</li>
						<li className="user-menu__item">
							{register_soundcloud_jsx}
						</li>
						{logout_jsx}
					</ul>
				</DropdownContent>
			</Dropdown>
		);
	}
});

export default UserMenu;
