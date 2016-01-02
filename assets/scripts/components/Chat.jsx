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

const CHANGE_EVENT = 'change';
const STARTS_WITH_LIKE_TEXT_REGEX = /^<3(?:$|\s)|^\+\+(?:$|\s)/;
const MAX_MESSAGES = 250;
const ENTER_KEY_CODE = 13;

var _getStateFromStore = function(){
	return {
		messages: ChatStore.getMessages( MAX_MESSAGES )
	};
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
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	handleNewMessageChange: function( event ){
		this.setState({
			new_message: event.target.value
		});
	},
	handleNewMessageKeyPress: function( event ){
		if( event.which === ENTER_KEY_CODE && !event.shiftKey ){
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
	},
	renderMessages: function(){
		var messages_jsx = this.state.messages.map( message => {
			switch( message.type ){
			case 'chat':
				return <ChatMessage key={message.uuid} message={message} />;
			case 'emote':
				return <ChatMessageEmote key={message.uuid} message={message} />;
			case 'title':
				return <ChatMessageTitle key={message.uuid} message={message} />;
			case 'like':
				return <ChatMessageLike key={message.uuid} message={message} />;
			case 'play':
				return <ChatMessagePlay key={message.uuid} message={message} />;
			case 'skip':
				return <ChatMessageSkip key={message.uuid} message={message} />;
			case 'remove':
				return <ChatMessageRemove key={message.uuid} message={message} />;
			case 'sort':
				return <ChatMessageSort key={message.uuid} message={message} />;
			case 'join':
				return <ChatMessageJoin key={message.uuid} message={message} />;
			case 'leave':
				return <ChatMessageLeave key={message.uuid} message={message} />;
			}
		});
		return messages_jsx;
	},
	render: function(){
		return (
			<div className="chat">
				<form className="new_message">
					<AutosizeTextarea
						name="new_message"
						value={this.state.new_message}
						placeholder="(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ type to chat"
						onChange={this.handleNewMessageChange}
						onKeyPress={this.handleNewMessageKeyPress}
					/>
				</form>
				<ul className="messages">
					{this.renderMessages()}
				</ul>
			</div>
		);
	}
});

export default Chat;
