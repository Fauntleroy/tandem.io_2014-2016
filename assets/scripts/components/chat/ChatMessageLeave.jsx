import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageLeave = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	render: function(){
		const { message } = this.props;
		return (
			<li className="leave">
				<i className="fa fa-chevron-left"></i>
				<User user={message.user} /> has left.
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageLeave;
