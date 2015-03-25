var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageTitle = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="title">
				<i className="fa fa-pencil"></i>
				<User user={message.user} /> changed the room title to: <strong>&ldquo;{message.title}&rdquo;</strong>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageTitle;