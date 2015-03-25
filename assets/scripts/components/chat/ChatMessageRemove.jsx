var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageRemove = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="remove">
				<i className="fa fa-remove"></i>
				<User user={message.user} /> removed&nbsp;
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

module.exports = ChatMessageRemove;