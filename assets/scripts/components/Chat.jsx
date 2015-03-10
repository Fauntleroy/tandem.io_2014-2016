var React = require('react');
var uuid = require('node-uuid');

var ChatMessage = require('./chat/ChatMessage.jsx');
var ChatMessageEmote = require('./chat/ChatMessageEmote.jsx');
var ChatActionCreator = require('../actions/ChatActionCreator.js');
var ChatStore = require('../stores/ChatStore.js');

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		messages: ChatStore.getMessages()
	}
};

var _generateMessages = function( messages ){
	var messages_jsx = messages.map( function( message ){
		switch( message.type ){
			case 'chat':
				return <ChatMessage key={message.uuid} message={message} />;
			break;
			case 'emote':
				return <ChatMessageEmote key={message.uuid} message={message} />;
			break;
		}
	});
	return messages_jsx;
};

var Chat = React.createClass({
	getInitialState: function(){
	    return _getStateFromStore();
	},
	componentDidMount: function(){
		ChatStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		ChatStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	render: function(){
		var messages_jsx = _generateMessages( this.state.messages );
		return (
			<div className="chat">
				<form className="new_message">
					<textarea
						name="new_message"
						value={this.state.new_message}
						placeholder="(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ type to chat"
						onChange={this._onNewMessageChange}
						onKeyPress={this._onNewMessageKeyPress}
					></textarea>
				</form>
				<ul className="messages">
					{messages_jsx}
				</ul>
			</div>
		);
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	_onNewMessageChange: function( event ){
		this.setState({
			new_message: event.target.value
		});
	},
	_onNewMessageKeyPress: function( event ){
		if( event.which === 13 && !event.shiftKey ){
			event.preventDefault();
			var new_message = this.state.new_message;
			if( new_message ){
				var emote_bits = /^\/me\s(.*)$/.exec( new_message );
				if( emote_bits ){
					ChatActionCreator.addEmote( emote_bits[1] );
				}
				else {
					ChatActionCreator.addMessage( new_message );
				}
				this.setState({
					new_message: ''
				});
			}
		}
	}
});

module.exports = Chat;