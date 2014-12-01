var _ = require('underscore');
var Backbone = require('backbone');

var Message = require('../models/message.js');

module.exports = Backbone.Collection.extend({
	model: Message,
	initialize: function( models, config ){
		_.bindAll( this, 'onMessage', 'onEmote', 'onJoin', 'onLeave', 'onPlay', 'onSkip', 'onLike' );
		this.mediator = config.mediator;
		this.socket = config.socket;
		this.user = config.user;
		this.listenTo( this.socket, 'chat:message', this.onMessage );
		this.listenTo( this.socket, 'chat:emote', this.onEmote );
		this.listenTo( this.socket, 'presences:join', this.onJoin );
		this.listenTo( this.socket, 'presences:leave', this.onLeave );
		this.listenTo( this.socket, 'player:play', this.onPlay );
		this.listenTo( this.socket, 'player:skip', this.onSkip );
		this.listenTo( this.socket, 'player:like', this.onLike );
	},
	sendMessage: function( message ){
		this.socket.emit( 'chat:message', message );
		// trigger a `like` in the player
		if( message === '++' || message === '<3' ){
			this.mediator.trigger('player:like');
		}
	},
	sendEmote: function( message ){
		this.socket.emit( 'chat:emote', message );
	},
	onMessage: function( message ){
		message.type = 'chat';
		// check if this user is sending the message
		message.self = ( message.user.id == this.user.id );
		this.add( message );
	},
	onEmote: function( message ){
		message.type = 'emote';
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
	onSkip: function( data ){
		var message = {
			type: 'skip',
			user: data.user,
			item: data.item
		};
		this.add( message );
	},
	onLike: function( data ){
		var message = {
			type: 'like',
			user: data.user,
			message: data.message
		};
		this.add( message );
	}
})
