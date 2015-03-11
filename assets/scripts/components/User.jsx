var React = require('react');

var User = React.createClass({
	render: function(){
		var user = this.props.user;
		return (
			<span className="user" data-user-id={user.id}>
				<img className="avatar" src={user.avatar} /> <strong className="name">{user.name}</strong>
			</span>
		);
	}
});

module.exports = User;