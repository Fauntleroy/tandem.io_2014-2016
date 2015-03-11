var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageLike = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="like">
				<i className="fa fa-heart"></i>
				&nbsp;
				<User user={message.user} />
				&nbsp;{message.content}
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageLike;