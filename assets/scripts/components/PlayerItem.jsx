import React from 'react';
import cx from 'classnames';

import User from './User.jsx';

var PlayerItem = React.createClass({
	render: function(){
		var item = this.props.item;
		var source_icon_classes_object = {
			fa: true
		};
		source_icon_classes_object['fa-'+ item.source] = true;
		var source_icon_classes = cx( source_icon_classes_object );
		return (
			<div className="player__item">
				<h2 className="player__item__title">
					<a href={item.url} target="_blank">{item.title}</a>
				</h2>
				Posted by&nbsp;
				<User user={item.user} />
				&nbsp;via&nbsp;
				<a href={item.url} target="_blank">
					<i className={source_icon_classes}></i>
				</a>
			</div>
		);
	}
});

export default PlayerItem;
