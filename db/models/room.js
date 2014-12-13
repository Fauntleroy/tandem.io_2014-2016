const NO_OP = function(){};

var Waterline = require('waterline');
var _ = require('underscore');

var Room = Waterline.Collection.extend({
	identity: 'room',
	connection: 'mysql',
	attributes: {
		name: {
			type: 'string',
			size: 60
		},
		player_order: {
			type: 'string',
			enum: ['fifo', 'shuffle'],
			defaultsTo: 'fifo'
		},
		player_likers: {
			type: 'json',
			defaultsTo: []
		},
		users: {
			type: 'json',
			defaultsTo: []
		},
		playlist: {
			type: 'json',
			defaultsTo: []
		},

		// instance methods
		// ensure the room is up and running
		initializeRoom: function( config ){
			var io = config.io;
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
				socket.emit( 'presences:list', room.data.users );
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
					room.removeItem( id );
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
		},
		// add a user to the users list
		addUser: function( user, cb ){

		},
		// remove a user from the users list
		removeUser: function( user, cb ){
			cb = cb || NO_OP;

		},
		addItem: function( item, cb ){

		},
		removeItem: function( item, cb ){

		},
		playItem: function( item, cb ){

		},
		likeItem: function( user, cb ){

		},
		nextItem: function( user, cb ){

		},
		setOrder: function( order, cb ){

		}
	},

	//// lifecycle events

	//// class methods

});