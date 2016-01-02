import React, { PropTypes } from 'react';

var User = React.createClass({
	propTypes: {
		user: PropTypes.shape({
			id: PropTypes.string,
			avatar: PropTypes.string,
			name: PropTypes.string
		})
	},
	render: function(){
		const { user } = this.props;
		const { avatar, id, name } = user;
		return (
			<span className="user" data-user-id={id}>
				<img className="user__avatar" src={avatar} /> <strong className="user__name">{name}</strong>
			</span>
		);
	}
});

export default User;
