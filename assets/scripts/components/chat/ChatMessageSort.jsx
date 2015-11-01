import React from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageSort = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="sort">
				<i className="fa fa-random"></i>
				<User user={message.user} /> moved&nbsp;
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

export default ChatMessageSort;
