var Backbone = require('backbone');
var _ = require('underscore');

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
quicksync.views = {
	rooms: new RoomsView({ collection: quicksync.rooms }),
};

// Start the routers
Backbone.history.start({ pushState: true });