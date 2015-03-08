var React = require('react');
var cx = require('classnames');

var User = require('./User.jsx');

var UsersStore = require('../stores/UsersStore.js');
// Even though this is never *used* it needs to be included so it is instantiated
var TandemUsersSocketUtils = require('../utils/TandemUsersSocketUtils.js');

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		users: UsersStore.getUsers()
	};
};

var _generateUsers = function( users ){
	var users_jsx = users.map( function( user ){
		var li_classes = cx({
			self: user.self
		});
		return (
			<li data-id={user.id} className={li_classes}>
				<User user={user} />
			</li>
		);
	});
	return users_jsx;
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
	render: function(){
		var users = _generateUsers( this.state.users );
		return (
			<ul className="users">
				{users}
			</ul>
		);
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	}
});

module.exports = Users;