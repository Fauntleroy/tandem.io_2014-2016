import React, { PropTypes } from 'react';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessageSort = React.createClass({
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
			<li className="sort">
				<i className="fa fa-random"></i>
				<User user={user} /> moved&nbsp;
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

export default ChatMessageSort;
