var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageLeave = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="leave">
				<i className="fa fa-chevron-right"></i>
				&nbsp;
				<User user={message.user} />
				&nbsp;has left.
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageLeave;