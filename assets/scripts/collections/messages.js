var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		this.mediator = config.mediator;
		this.socket = config.socket;
		this.listenTo( this.socket, 'chat:message', this.onMessage );
		this.listenTo( this.socket, 'presences:join', this.onJoin );
		this.listenTo( this.socket, 'presences:leave', this.onLeave );
		this.listenTo( this.socket, 'player:play', this.onPlay );
		this.listenTo( this.socket, 'player:skip', this.onSkip );
	},
	sendMessage: function( message ){
		this.socket.emit( 'chat:message', message );
	},
	onMessage: function( message ){
		message.type = 'chat';
		this.add( message );
	},
	onJoin: function( user ){
		var message = {
			type: 'join',
			user: user
		};
		this.add( message );
	},
	onLeave: function( user ){
		var message = {
			type: 'leave',
			user: user
		};
		this.add( message );
	},
	onPlay: function( item ){
		var message = {
			type: 'play',
			item: item
		};
		this.add( message );
	},
	onSkip: function( user, item ){
		var message = {
			type: 'skip',
			user: user,
			item: item
		};
		this.add( message );
	}
})