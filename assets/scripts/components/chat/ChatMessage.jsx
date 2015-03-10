var React = require('react');
var cx = require('classnames');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessage = React.createClass({
	render: function(){
		var message = this.props.message;
		var li_classes = cx({
			chat: true,
			self: ( message.user.id === tandem.bridge.user.id )
		});
		return (
			<li className={li_classes}>
				<div className="content">{message.content}</div>
				<User user={message.user} />
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessage;