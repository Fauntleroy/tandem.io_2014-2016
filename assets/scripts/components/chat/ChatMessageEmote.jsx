import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageEmote = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			content: PropTypes.array,
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	render: function(){
		const { message } = this.props;
		const { content, time, user } = message;
		return (
			<li className="emote">
				<User user={user} /> <span className="content">{content}</span>
				<Timestamp time={time} />
			</li>
		);
	}
});

export default ChatMessageEmote;
