import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageLeave = React.createClass({
	render: function(){
		var message = this.props.message;
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
