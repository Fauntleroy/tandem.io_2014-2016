var React = require('react');
var cx = require('classnames');

var secondsToTime = require('../utils/secondsToTime.js');

var User = require('./User.jsx');
var PlaylistActionCreator = require('../actions/PlaylistActionCreator.js');

var PlaylistItem = React.createClass({
	render: function(){
		var item = this.props.item;
		var image_classes_object = {
			image: true
		};
		image_classes_object[item.source] = true;
		var image_classes = cx( image_classes_object );
		var image_style = {
			'background-image': 'url('+ item.image +')'
		};
		var source_icon_classes_object = {
			fa: true
		};
		source_icon_classes_object['fa-'+ item.source] = true;
		var source_icon_classes = cx( source_icon_classes_object );
		return (
			<li data-id={item.id}>
				<span className={image_classes} style={image_style} />
				<h3 className="title">
					<a href={item.url} target="_blank">{item.title}</a>
				</h3>
				<br />
				Posted by&nbsp;
				<User user={item.user} />
				&nbsp;via&nbsp;
				<a href={item.url} target="_blank">
					<i className={source_icon_classes}></i>
				</a>
				<var className="duration">{secondsToTime( item.duration )}</var>
				<a className="remove" href="#remove" onClick={this._onRemoveClick}>
					<i className="fa fa-times"></i>
				</a>
			</li>
		);
	},
	_onRemoveClick: function( event ){
		event.preventDefault();
		PlaylistActionCreator.removeItem( this.props.item.id );
	}
});

module.exports = PlaylistItem;