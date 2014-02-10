var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

// Application modules
var Router = require('./routers/router.js');
var Room = require('./models/room.js');
var Rooms = require('./collections/rooms.js');
var RoomsView = require('./views/rooms.js');

window.quicksync = window.quicksync || {};
var mediator = quicksync.mediator = _.extend( {}, Backbone.Events );
quicksync.router = new Router({ mediator: mediator });
quicksync.room = new Room( null, { mediator: mediator });
quicksync.rooms = new Rooms( null, { mediator: mediator });

// Wait for DOM so views will work
$( function(){
	quicksync.views = {
		rooms: new RoomsView({
			el: '#rooms',
			collection: quicksync.rooms
		}),
	};

	// Start the routers
	Backbone.history.start({ pushState: true });
});