import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageJoin = React.createClass({
	render: function(){
		var message = this.props.message;
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
