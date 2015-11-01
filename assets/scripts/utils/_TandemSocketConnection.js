import querystring from 'querystring';
import io from 'socket.io-client';

var TandemSocketConnection = io.connect( location.protocol +'//'+ location.host +'/rooms/'+ tandem.bridge.room.id, {
	query: querystring.stringify({
		token: tandem.bridge.user.token,
		id: tandem.bridge.user.id,
		name: tandem.bridge.user.name,
		avatar: tandem.bridge.user.avatar
	})
});

export default TandemSocketConnection;
