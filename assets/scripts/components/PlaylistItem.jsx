import React, { PropTypes } from 'react';
import cx from 'classnames';

import secondsToTime from '../utils/secondsToTime.js';

import User from './User.jsx';
import PlaylistActionCreator from '../actions/PlaylistActionCreator.js';

var PlaylistItem = React.createClass({
	propTypes: {
		item: PropTypes.shape({
			duration: PropTypes.number,
			id: PropTypes.string,
			image: PropTypes.string,
			source: PropTypes.string,
			title: PropTypes.string,
			url: PropTypes.string,
			user: PropTypes.object
		})
	},
	handleRemoveClick: function( event ){
		event.preventDefault();
		PlaylistActionCreator.removeItem( this.props.item.id );
	},
	render: function(){
		const { item } = this.props;
		const { duration, id, image, source, title, url, user } = item;
		const image_classes = `image ${source}`;
		const image_style = {
			backgroundImage: `url(${image})`
		};
		const source_icon_classes = cx({
			'fa': true,
			[`fa-${source}`]: true
		});
		return (
			<div data-id={id}>
				<span className={image_classes} style={image_style} />
				<h3 className="title">
					<a href={url} target="_blank">{title}</a>
				</h3>
				<br />
				Posted by&nbsp;
				<User user={user} />
				&nbsp;via&nbsp;
				<a href={url} target="_blank">
					<i className={source_icon_classes}></i>
				</a>
				<var className="duration">{secondsToTime( duration )}</var>
				<a className="remove" href="#remove" onClick={this.handleRemoveClick}>
					<i className="fa fa-times"></i>
				</a>
			</div>
		);
	}
});

export default PlaylistItem;
