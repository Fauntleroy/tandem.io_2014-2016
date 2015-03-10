var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessage = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="emote">
				<User user={message.user} />
				<span className="content">{message.content}</span>
				<Timestamp time={message.timestamp} />
			</li>
		);
	}
});

module.exports = ChatMessage;