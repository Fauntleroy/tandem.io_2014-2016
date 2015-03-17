var React = require('react');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var ChatMessageSort = React.createClass({
	render: function(){
		var message = this.props.message;
		return (
			<li className="sort">
				<i className="fa fa-random"></i>
				<User user={message.user} /> moved&nbsp;
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

module.exports = ChatMessageSort;