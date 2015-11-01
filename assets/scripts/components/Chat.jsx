import React from 'react';

import AutosizeTextarea from 'react-textarea-autosize';
import ChatMessage from './chat/ChatMessage.jsx';
import ChatMessageEmote from './chat/ChatMessageEmote.jsx';
import ChatMessageTitle from './chat/ChatMessageTitle.jsx';
import ChatMessageLike from './chat/ChatMessageLike.jsx';
import ChatMessagePlay from './chat/ChatMessagePlay.jsx';
import ChatMessageSkip from './chat/ChatMessageSkip.jsx';
import ChatMessageRemove from './chat/ChatMessageRemove.jsx';
import ChatMessageSort from './chat/ChatMessageSort.jsx';
import ChatMessageJoin from './chat/ChatMessageJoin.jsx';
import ChatMessageLeave from './chat/ChatMessageLeave.jsx';
import ChatActionCreator from '../actions/ChatActionCreator.js';
import PlayerActionCreator from '../actions/PlayerActionCreator.js';
import ChatStore from '../stores/ChatStore.js';
import PlayerStore from '../stores/PlayerStore.js';

var CHANGE_EVENT = 'change';
var STARTS_WITH_LIKE_TEXT_REGEX = /^<3(?:$|\s)|^\+\+(?:$|\s)/;

var _getStateFromStore = function(){
	return {
		messages: ChatStore.getMessages( 250 )
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
			case 'title':
				return <ChatMessageTitle key={message.uuid} message={message} />;
			break;
			case 'like':
				return <ChatMessageLike key={message.uuid} message={message} />;
			break;
			case 'play':
				return <ChatMessagePlay key={message.uuid} message={message} />;
			break;
			case 'skip':
				return <ChatMessageSkip key={message.uuid} message={message} />;
			break;
			case 'remove':
				return <ChatMessageRemove key={message.uuid} message={message} />;
			break;
			case 'sort':
				return <ChatMessageSort key={message.uuid} message={message} />;
			break;
			case 'join':
				return <ChatMessageJoin key={message.uuid} message={message} />;
			break;
			case 'leave':
				return <ChatMessageLeave key={message.uuid} message={message} />;
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
					<AutosizeTextarea
						name="new_message"
						value={this.state.new_message}
						placeholder="(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ type to chat"
						onChange={this._onNewMessageChange}
						onKeyPress={this._onNewMessageKeyPress}
					/>
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
				// auto-like items if they start with...
				if( STARTS_WITH_LIKE_TEXT_REGEX.test( new_message ) ){
					var item = PlayerStore.getItem();
					PlayerActionCreator.likeItem( item );
				}
				this.setState({
					new_message: ''
				});
			}
		}
	}
});

export default Chat;
