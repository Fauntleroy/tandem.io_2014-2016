import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageRemove = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="remove">
				<i className="fa fa-remove"></i>
				<User user={message.user} /> removed&nbsp;
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

export default ChatMessageRemove;
