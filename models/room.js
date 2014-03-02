const PLAYER_TICK_INTERVAL_SECONDS = 3;
const PLAYER_TICK_INTERVAL = PLAYER_TICK_INTERVAL_SECONDS * 1000;
const AUTH_TIMEOUT = 15 * 1000;
const NO_OP = function(){};

var _ = require('underscore');
var uuid = require('node-uuid');

var io;
var rooms = [];

var generateAuthToken = require('../utils/generateAuthToken.js');

var Room = function( data, options ){

	var room = this;

	// give the room an id
	this.id = uuid.v4();
	var namespace = this.namespace = 'rooms/'+ this.id;

	// set up default data
	this.data = {
		id: this.id,
		name: 'Default Room Name',
		player: {
			order: 'fifo'
		},
		users: [],
		playlist: []
	};

	// extend data with passed in data
	this.data = _.extend( this.data, data );

	// listen for user connections
	io.of( namespace ).on( 'connection', function( socket ){
		var sid = socket.sid;
		// start an auth timer
		// disconnect user if they do not connect within time limit
		var auth_timeout = setTimeout( function(){
			socket.close();
		}, AUTH_TIMEOUT );
		socket.once( 'auth', function( data, cb ){
			var id = data.id;
			var name = data.name;
			var token = data.token;
			var is_authentic = ( generateAuthToken( id, name ) === token );
			if( !is_authentic ){
				cb( new Error('Authentication failed') );
				socket.close();
				return;
			}
			// disable auth timer
			clearTimeout( auth_timeout );

			// send current presence list
			socket.emit( 'presences:list', room.data.users );
			// add connection to presences
			var presence = {
				id: id,
				name: name,
				sid: sid
			};
			room.addPresence( presence );
			socket.on( 'disconnect', function(){
				room.removePresence( presence );
			});

			// send existing playlist
			socket.emit( 'playlist:list', room.data.playlist );
			// send existing player
			socket.emit( 'player:state', room.data.player );

			// listen for commands from the user
			socket.on( 'chat:message', function( message ){
				io.of( namespace ).emit( 'chat:message', message );
			});
			socket.on( 'playlist:add', function( item ){
				room.addItem( item );
			});
			socket.on( 'playlist:remove', function( id ){
				room.removeItem( id );
			});
			socket.on( 'player:skip', function(){
				room.nextItem();
			});
			socket.on( 'player:order', function( order ){
				room.setOrder( order );
			});

		});
	});

	// add room instance to rooms collection
	rooms.push( room );

};

Room.list = function( convert ){
	if( convert ){
		return rooms.map( function( room ){
			return room.data;
		});
	}
	return rooms;
}

Room.findById = function( id, convert ){
	var room = _.find( rooms, function( room ){
		return room.id === id;
	});
	if( convert ){
		return room.data;
	}
	return room;
};

// add a user presence
Room.prototype.addPresence = function( presence ){
	var sessions;
	// check to see if id exists
	var existing_user = _.find( this.data.users, function( user ){
		return user.id === presence.id;
	});
	// if id exists, add sid to sids array
	if( existing_user ){
		existing_user.sids.push( presence.sid );
	}
	// if id does not exist, add new user to users array
	else {
		this.data.users.push({
			id: presence.id,
			name: presence.name,
			sids: [ presence.sid ]
		});
		io.of( this.namespace ).emit( 'presences:join', presence );
	}
	return;
};

// remove a user presence
Room.prototype.removePresence = function( presence ){
	// find user with id
	var existing_user = _.find( this.data.users, function( user ){
		return user.id === presence.id;
	});
	if( !existing_user ) return new Error('No user '+ presence.id );
	// remove sid
	existing_user.sids = _.without( existing_user.sids, presence.sid );
	// if sids.length === 0 remove user from users array
	if( existing_user.sids.length === 0 ){
		this.data.users = _.without( this.data.users, existing_user );
		io.of( this.namespace ).emit( 'presences:leave', presence );
	}
	return;
};

Room.prototype.addItem = function( item ){
	item.id = uuid.v4();
	this.data.playlist.push( item );
	io.of( this.namespace ).emit( 'playlist:add', item );
	if( !this.data.player.item ) this.nextItem();
	return item;
};

Room.prototype.removeItem = function( id ){
	var item = _.findWhere( this.data.playlist, { id: id } );
	this.data.playlist = _.without( this.data.playlist, item );
	io.of( this.namespace ).emit( 'playlist:remove', item );
	return item;
};

Room.prototype.playItem = function( item ){
	// reset timer
	if( this.player_interval ) clearInterval( this.player_interval );
	this.data.player.elapsed = 0;
	// clear player if we're playing nothing
	if( !item ){
		this.data.player.item = null;
	}
	// set item and start player interval
	else {
		this.data.player.item = item;
		this.player_interval = setInterval( function(){
			this.data.player.elapsed += PLAYER_TICK_INTERVAL_SECONDS;
			if( this.data.player.elapsed >= this.data.player.item.duration ){
				this.nextItem();
			}
			else {
				io.of( this.namespace ).emit( 'player:elapsed', this.data.player.elapsed );
			}
		}.bind( this ), PLAYER_TICK_INTERVAL );
	}
	io.of( this.namespace ).emit( 'player:play', item );
};

Room.prototype.nextItem = function(){
	var current_item = this.data.player.item;
	var next_item;
	switch( this.data.player.order ){
		case 'fifo':
			next_item = this.data.playlist[0];
		break;
		case 'shuffle':
			next_item = _.sample( this.data.playlist );
		break;
	}
	if( next_item ){
		this.removeItem( next_item.id );
	}
	this.playItem( next_item );
};

Room.prototype.setOrder = function( order ){
	order = order || 'fifo';
	var orders = ['fifo','shuffle'];
	if( orders.indexOf( order ) < 0 ) return new Error('Invalid order '+ order);
	this.data.player.order = order;
	io.of( this.namespace ).emit( 'player:order', order );
	return order;
}

// export a function so we can pass in http_server instance
module.exports = function( config ){
	io = config.io;
	return Room;
};