import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageTitle = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			time: PropTypes.any,
			title: PropTypes.string,
			user: PropTypes.object
		})
	},
	render: function(){
		const { message } = this.props;
		const { time, title, user } = message;
		return (
			<li className="title">
				<i className="fa fa-pencil"></i>
				<User user={user} /> changed the room title to: <strong>&ldquo;{title}&rdquo;</strong>
				<Timestamp time={time} />
			</li>
		);
	}
});

export default ChatMessageTitle;
