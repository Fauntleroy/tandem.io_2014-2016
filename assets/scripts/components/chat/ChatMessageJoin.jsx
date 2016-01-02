import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageJoin = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	render: function(){
		const { message } = this.props;
		return (
			<li className="join">
				<i className="fa fa-chevron-right"></i>
				<User user={message.user} /> has joined.
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageJoin;
