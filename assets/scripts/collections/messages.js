var es = require('event-stream');
var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
	initialize: function( models, config ){
		_( this ).bindAll( 'processStream' );
		this.mediator = config.mediator;
		var write_stream = es.through( this.preprocessStream );
		write_stream.pipe( config.stream );
		this.stream = es.duplex( write_stream, config.stream );
		this.stream.on( 'data', this.processStream );
	},
	// Modify data object before sending to stream
	preprocessStream: function( data ){
		data.module = 'chat';
		this.queue( data );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		if( data.module === 'chat' ){
			switch( data.type ){
			case 'message':
				data.payload.user = data.user;
				this.onMessage( data.payload );	
			break;
			}
		}
		else if( data.module === 'presences' ){
			switch( data.type ){
				case 'join':
					this.onJoin( data.payload.user );
				break;
				case 'leave':
					this.onLeave( data.payload.user );
				break;
			}
		}
		else if( data.module === 'player' ){
			switch( data.type ){
				case 'play':
					this.onPlay( data.payload );
				break;
			}
		}
	},
	sendMessage: function( message ){
		this.stream.write({
			type: 'message',
			payload: {
				content: message
			}
		});
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
	}
})