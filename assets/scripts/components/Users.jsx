import React from 'react';
import cx from 'classnames';

import User from './User.jsx';

import UsersStore from '../stores/UsersStore.js';
// Even though this is never *used* it needs to be included so it is instantiated
import '../utils/TandemUsersSocketUtils.js';

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		users: UsersStore.getUsers()
	};
};

var Users = React.createClass({
	getInitialState: function(){
		return _getStateFromStore();
	},
	componentDidMount: function(){
		UsersStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		UsersStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	renderUsers: function(){
		var users_jsx = this.state.users.map( function( user ){
			var li_classes = cx({
				users__user: true,
				'users__user--self': ( user.id === tandem.bridge.user.id )
			});
			return (
				<li key={user.id} data-id={user.id} className={li_classes}>
					<User user={user} />
				</li>
			);
		});
		return users_jsx;
	},
	render: function(){
		return (
			<ul className="users">
				{this.renderUsers()}
			</ul>
		);
	}
});

export default Users;
