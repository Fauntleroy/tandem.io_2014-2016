const PLAYER_TICK_INTERVAL_SECONDS = 3;
const PLAYER_TICK_INTERVAL = PLAYER_TICK_INTERVAL_SECONDS * 1000;
const AUTH_TIMEOUT = 15 * 1000;
const MAX_TITLE_LENGTH = 50;
const NO_OP = function(){};

var _ = require('underscore');
var uuid = require('node-uuid');

var io;
var rooms = [];

var generateAuthToken = require('../utils/generateAuthToken.js');
var likeMessage = require('../utils/likeMessage.js');
var generateRoomName = require('../utils/generateRoomName.js');
var move = require('../utils/move.js');

var Room = function( data, options ){

	var room = this;

	// give the room an id
	this.id = uuid.v4();
	var namespace = this.namespace = '/rooms/'+ this.id;

	// set up default data
	this.data = {
		id: this.id,
		name: generateRoomName(),
		private: false,
		player: {
			order: 'fifo',
			likers: []
		},
		users: [],
		playlist: []
	};

	// extend data with passed in data
	this.data = _.extend( this.data, data );

	// listen for user connections
	io.of( namespace ).on( 'connection', function( socket ){
		var sid = socket.id;
		var auth_data = _.pick( socket.request._query, 'id', 'name', 'avatar', 'token' );
		var id = auth_data.id;
		var name = auth_data.name;
		var avatar = auth_data.avatar;
		var token = auth_data.token;
		var user = {
			id: id,
			name: name,
			avatar: avatar
		};

		// send current presence list
		var users_data = room.data.users.map( function( user ){
			return _.pick( user, 'id', 'name', 'avatar' );
		});
		socket.emit( 'presences:list', users_data );
		// add connection to presences
		var presence = {
			id: id,
			name: name,
			avatar: avatar,
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
		socket.on( 'room:title', function( title ){
			room.setTitle( title, user );
		});
		socket.on( 'chat:message', function( content ){
			var message = {
				content: content,
				user: user
			};
			io.of( namespace ).emit( 'chat:message', message );
		});
		socket.on( 'chat:emote', function( content ){
			var message = {
				content: content,
				user: user
			};
			io.of( namespace ).emit( 'chat:emote', message );
		});
		socket.on( 'playlist:add', function( item, callback ){
			callback = callback || NO_OP;
			item.user = user;
			room.addItem( item );
			callback( null );
		});
		socket.on( 'playlist:remove', function( id ){
			room.removeItem( id, user );
		});
		socket.on( 'playlist:sort:start', function(){
			room.sortStart( user );
		});
		socket.on( 'playlist:sort:end', function( origin, destination ){
			room.sortEnd( origin, destination, user );
		});
		socket.on( 'player:skip', function(){
			room.nextItem( user );
		});
		socket.on( 'player:like', function(){
			room.likeItem( user );
		});
		socket.on( 'player:order', function( order ){
			room.setOrder( order );
		});
	});

	// add room instance to rooms collection
	rooms.push( room );

};

Room.list = function( options ){
	var public_rooms = rooms.filter( function( room ){
		return !room.data.private;
	});
	if( options.convert ){
		return public_rooms.map( function( room ){
			return room.data;
		});
	}
	return public_rooms;
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
			avatar: presence.avatar,
			sids: [ presence.sid ]
		});
		var presence_data = _.pick( presence, 'id', 'name', 'avatar' );
		io.of( this.namespace ).emit( 'presences:join', presence_data );
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
		var presence_data = _.pick( presence, 'id', 'name', 'avatar' );
		io.of( this.namespace ).emit( 'presences:leave', presence );
	}
	return;
};

Room.prototype.setTitle = function( title, user ){
	title = String( title ).substring( 0, MAX_TITLE_LENGTH );
	this.data.name = title;
	io.of( this.namespace ).emit( 'room:title', title, user );
};

Room.prototype.addItem = function( item ){
	item.id = uuid.v4();
	this.data.playlist.push( item );
	io.of( this.namespace ).emit( 'playlist:add', item );
	if( !this.data.player.item ) this.nextItem();
	return item;
};

Room.prototype.removeItem = function( id, user ){
	var item = _.findWhere( this.data.playlist, { id: id } );
	this.data.playlist = _.without( this.data.playlist, item );
	io.of( this.namespace ).emit( 'playlist:remove', item, user );
	return item;
};

Room.prototype.playItem = function( item ){
	// reset timer
	if( this.player_interval ) clearInterval( this.player_interval );
	this.data.player.elapsed = 0;
	this.data.player.likers = [];
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

Room.prototype.nextItem = function( user ){
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
	if( user ){
		io.of( this.namespace ).emit( 'player:skip', {
			item: current_item,
			user: user
		});
	}
	this.playItem( next_item );
};

Room.prototype.likeItem = function( user ){
	var current_item = this.data.player.item;
	if( !current_item ) return new Error('No item in player');
	var likers = this.data.player.likers;
	var already_liked = !!_.findWhere( likers, { id: user.id } );
	if( already_liked ) return new Error('User already liked item');
	likers.push( user );
	io.of( this.namespace ).emit( 'player:like', {
		user: user,
		message: likeMessage(),
		likers: likers
	});
};

Room.prototype.setOrder = function( order ){
	order = order || 'fifo';
	var orders = ['fifo','shuffle'];
	if( orders.indexOf( order ) < 0 ) return new Error('Invalid order '+ order);
	this.data.player.order = order;
	io.of( this.namespace ).emit( 'player:order', order );
	return order;
};

Room.prototype.sortStart = function( user ){
	io.of( this.namespace ).emit( 'playlist:sort:start', user );
};

Room.prototype.sortEnd = function( origin, destination, user ){
	var item = this.data.playlist[origin];
	move( this.data.playlist, origin, destination );
	io.of( this.namespace ).emit( 'playlist:sort:end', origin, destination, item, user );
};

// export a function so we can pass in http_server instance
module.exports = function( config ){
	io = config.io;
	return Room;
};
