var React = require('react');
var cx = require('classnames');

var User = require('../User.jsx');
var Timestamp = require('./Timestamp.jsx');

var _generateContent = function( content ){
	return content.map( function( message_content ){
		return <p>{message_content}</p>;
	});
};

var ChatMessage = React.createClass({
	render: function(){
		var message = this.props.message;
		var li_classes = cx({
			chat: true,
			self: ( message.user.id === tandem.bridge.user.id )
		});
		var content_jsx = _generateContent( message.content );
		return (
			<li className={li_classes}>
				<div className="content">
					{content_jsx}
				</div>
				<User user={message.user} />
				<Timestamp time={message.time} />
			</li>
		);
	}
});

module.exports = ChatMessage;