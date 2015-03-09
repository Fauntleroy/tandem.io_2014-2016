var querystring = require('querystring');
var io = require('socket.io-client');

var TandemSocketConnection = io.connect( '/rooms/'+ tandem.bridge.room.id, {
	query: querystring.stringify({
		token: tandem.bridge.user.token,
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		avatar: tandem.bridge.user.avatar
	})
});

module.exports = TandemSocketConnection;