import React, { PropTypes } from 'react';
import cx from 'classnames';

import Linkify from 'react-linkify';
import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessage = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			content: PropTypes.array,
			time: PropTypes.any,
			user: PropTypes.object
		})
	},
	renderContent: function(){
		const { content } = this.props.message;
		return content.map( message_content => {
			const { text, uuid } = message_content;
			return <p key={uuid}>{text}</p>;
		});
	},
	render: function(){
		const { message } = this.props;
		const { time, user } = message;
		var li_classes = cx({
			chat: true,
			self: ( user.id === tandem.bridge.user.id )
		});
		return (
			<li className={li_classes}>
				<div className="content">
					<Linkify properties={{ target: '_blank' }}>
						{this.renderContent()}
					</Linkify>
				</div>
				<User user={user} />
				<Timestamp time={time} />
			</li>
		);
	}
});

export default ChatMessage;
