import ChatServerActionCreator from '../actions/ChatServerActionCreator.js';
import TandemSocketConnection from './_TandemSocketConnection.js';

var _onReceiveMessage = function( message ){
	message.type = 'chat';
	ChatServerActionCreator.receiveAddMessage( message );
};

var _onReceiveEmote = function( message ){
	message.type = 'emote';
	ChatServerActionCreator.receiveAddEmote( message );
};

TandemSocketConnection.on( 'chat:message', _onReceiveMessage );
TandemSocketConnection.on( 'chat:emote', _onReceiveEmote );

var TandemChatSocketUtils = {
	addMessage: function( message ){
		TandemSocketConnection.emit( 'chat:message', message );
	},
	addEmote: function( message ){
		TandemSocketConnection.emit( 'chat:emote', message );
	}
};

export default TandemChatSocketUtils;
