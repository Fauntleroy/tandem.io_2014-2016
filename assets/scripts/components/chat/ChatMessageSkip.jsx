var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageSkip = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="skip">
				<i className="fa fa-forward"></i>
				&nbsp;
				<User user={message.user} />
				&nbsp;skipped&nbsp;
				<span className="item">
					<strong className="title">
						<a href={message.item.url} target="_blank">{message.item.title}</a>
					</strong>
				</span>
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessageSkip;