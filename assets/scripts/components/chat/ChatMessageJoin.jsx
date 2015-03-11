var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageJoin = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="join">
				<i className="fa fa-chevron-right"></i>
				&nbsp;
				<User user={message.user} />
				&nbsp;has joined.
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageJoin;