import React, { PropTypes } from 'react';
import cx from 'classnames';

import User from './User.jsx';

var PlayerItem = React.createClass({
	propTypes: {
		item: PropTypes.object
	},
	render: function(){
		const { item } = this.props;
		const { source, title, url, user } = item;
		const source_icon_classes = cx({
			fa: true,
			[`fa-${source}`]: true
		});
		return (
			<div className="player__item">
				<h2 className="player__item__title">
					<a href={url} target="_blank">{title}</a>
				</h2>
				Posted by&nbsp;
				<User user={user} />
				&nbsp;via&nbsp;
				<a href={url} target="_blank">
					<i className={source_icon_classes}></i>
				</a>
			</div>
		);
	}
});

export default PlayerItem;
