var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageSkip = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="skip">
				<i class="fa fa-forward"></i>
				<User user={message.user} />
				skipped
				<span class="item">
					<strong class="title">
						<a href={message.item.url} target="_blank">{message.item.title}</a>
					</strong>
				</span>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageSkip;