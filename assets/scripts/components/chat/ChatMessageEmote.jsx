import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageEmote = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="emote">
				<User user={message.user} /> <span className="content">{message.content}</span>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageEmote;
