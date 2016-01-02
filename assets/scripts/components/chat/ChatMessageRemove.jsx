import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageRemove = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			item: PropTypes.object,
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	render: function(){
		const { message } = this.props;
		const { item, time, user } = message;
		return (
			<li className="remove">
				<i className="fa fa-remove"></i>
				<User user={user} /> removed&nbsp;
				<span className="item">
					<strong className="title">
						<a href={item.url} target="_blank">{item.title}</a>
					</strong>
				</span>
				<Timestamp time={time} />
			</li>
		);
	}
});

export default ChatMessageRemove;
