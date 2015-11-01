import React from 'react';

var User = React.createClass({
	render: function(){
		var user = this.props.user;
		return (
			<span className="user" data-user-id={user.id}>
				<img className="user__avatar" src={user.avatar} /> <strong className="user__name">{user.name}</strong>
			</span>
		);
	}
});

export default User;
