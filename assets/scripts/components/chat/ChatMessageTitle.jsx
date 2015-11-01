import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageTitle = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="title">
				<i className="fa fa-pencil"></i>
				<User user={message.user} /> changed the room title to: <strong>&ldquo;{message.title}&rdquo;</strong>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageTitle;
