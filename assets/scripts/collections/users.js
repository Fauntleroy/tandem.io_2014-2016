var Backbone = require('backbone');
var _ = require('underscore');
var User = require('../models/user.js');

module.exports = Backbone.Collection.extend({
	model: User,
	initialize: function( data, config ){
		_( this ).bindAll( 'processStream', 'onList', 'onJoin', 'onLeave' );
		this.mediator = config.mediator;
		this.stream = config.stream;
		this.stream.on( 'data', this.processStream );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		if( data.module === 'presences' ){
			switch( data.type ){
			case 'list':
				this.onList( data.payload.users );
			break;
			case 'join':
				this.onJoin( data.payload.user );
			break;
			case 'leave':
				this.onLeave( data.payload.user );
			break;
			}
		}
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