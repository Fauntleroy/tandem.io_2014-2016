import RoomServerActionCreator from '../actions/RoomServerActionCreator.js';
import TandemSocketConnection from './_TandemSocketConnection.js';

var _onReceiveSetTitle = function( title, user ){
	RoomServerActionCreator.receiveSetTitle( title, user );
};

TandemSocketConnection.on( 'room:title', _onReceiveSetTitle );

var TandemRoomSocketUtils = {
	setTitle: function( title ){
		TandemSocketConnection.emit( 'room:title', title );
	}
};

export default TandemRoomSocketUtils;
