import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageSkip = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="skip">
				<i className="fa fa-forward"></i>
				<User user={message.user} /> skipped&nbsp;
				<span className="item">
					<strong className="title">
						<a href={message.item.url} target="_blank">{message.item.title}</a>
					</strong>
				</span>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessageSkip;
