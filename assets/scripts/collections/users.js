var Backbone = require('backbone');
var _ = require('underscore');
var User = require('../models/user.js');

module.exports = Backbone.Collection.extend({
	model: User,
	initialize: function( data, config ){
		_.bindAll( this, 'onList', 'onJoin', 'onLeave' );
		this.mediator = config.mediator;
		this.socket = config.socket;
		this.user = config.user;
		this.listenTo( this.socket, 'presences:list', this.onList );
		this.listenTo( this.socket, 'presences:join', this.onJoin );
		this.listenTo( this.socket, 'presences:leave', this.onLeave );
	},
	// populate users collection
	onList: function( users ){
		this.reset( users );
	},
	// add a new user
	onJoin: function( user_data ){
		user_data.sids = [ user_data.sid ];
		delete user_data.sid;
		this.add( user_data );
	},
	// remove a leaving user
	onLeave: function( user_data ){
		var user = this.get( user_data.id );
		this.remove( user );
	}
});
