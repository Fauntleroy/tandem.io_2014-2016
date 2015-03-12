var React = require('react');
var cx = require('classnames');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessagePlay = React.createClass({
	render: function(){
		var message = this.props.message;
		if( !message.item ){
			return (
				<li className="play">
					<em>The player is now empty.</em>
					<Timestamp time={message.time} />
				</li>
			);
		}
		var thumbnail_classes_object = {
			image: true
		};
		thumbnail_classes_object[message.item.source] = true;
		var thumbnail_classes = cx( thumbnail_classes_object );
		var thumbnail_style = {
			backgroundImage: 'url('+ message.item.image +')'
		};
		return (
			<li className="play">
				<span className="item">
					<span className={thumbnail_classes} style={thumbnail_style} />
					<h3 className="title"><a href={message.item.url} target="_blank">{message.item.title}</a></h3>
				</span>
				<User user={message.item.user} />
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessagePlay;