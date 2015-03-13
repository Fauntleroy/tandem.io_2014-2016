var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageEmote = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="emote">
				<User user={message.user} /> <span className="content">{message.content}</span>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageEmote;