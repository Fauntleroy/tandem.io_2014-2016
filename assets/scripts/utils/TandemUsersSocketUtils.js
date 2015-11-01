import TandemSocketConnection from './_TandemSocketConnection.js';
import UsersServerActionCreator from '../actions/UsersServerActionCreator.js';

var _onState = function( state ){
	UsersServerActionCreator.receiveState( state );
};

var _onJoin = function( user ){
	UsersServerActionCreator.receiveJoin( user );
};

var _onLeave = function( user ){
	UsersServerActionCreator.receiveLeave( user );
};

TandemSocketConnection.on( 'presences:list', _onState );
TandemSocketConnection.on( 'presences:join', _onJoin );
TandemSocketConnection.on( 'presences:leave', _onLeave );

var TandemPlayerSocketUtils = {};

export default TandemPlayerSocketUtils;
