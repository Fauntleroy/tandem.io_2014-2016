import React, { PropTypes } from 'react';
import cx from 'classnames';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

var ChatMessagePlay = React.createClass({
	propTypes: {
		message: PropTypes.shape({
			item: PropTypes.object,
			time: PropTypes.any
		})
	},
	render: function(){
		const { message } = this.props;
		const { item, time } = message;
		if( !item ){
			return (
				<li className="play">
					<em>The player is now empty.</em>
					<Timestamp time={time} />
				</li>
			);
		}
		var thumbnail_classes_object = {
			image: true
		};
		thumbnail_classes_object[item.source] = true;
		var thumbnail_classes = cx( thumbnail_classes_object );
		var thumbnail_style = {
			backgroundImage: `url(${item.image})`
		};
		return (
			<li className="play">
				<span className="item">
					<span className={thumbnail_classes} style={thumbnail_style} />
					<h3 className="title"><a href={item.url} target="_blank">{item.title}</a></h3>
				</span>
				<User user={item.user} />
				<Timestamp time={time} />
			</li>
		);
	}
});

export default ChatMessagePlay;
