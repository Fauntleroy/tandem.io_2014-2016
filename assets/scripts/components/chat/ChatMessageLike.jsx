import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageLike = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			content: PropTypes.string,
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	render: function(){
		var message = this.props.message;
		return (
			<li className="like">
				<i className="fa fa-heart"></i>
				<User user={message.user} /> {message.content}
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageLike;
