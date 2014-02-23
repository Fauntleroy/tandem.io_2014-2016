var NO_OP = function(){};
var VOLUME_KEY = 'quicksync_volume';
var MUTE_KEY = 'quicksync_mute';

var Backbone = require('backbone');
var _ = require('underscore');
var es = require('event-stream');
var store = require('store');

module.exports = Backbone.Model.extend({
	defaults: {
		elapsed: 0,
		duration: 0,
		item: null,
		volume: store.get( VOLUME_KEY ) || 75,
		mute: store.get( MUTE_KEY ) || false
	},
	initialize: function( data, config ){
		_( this ).bindAll( 'processStream',
			'onState', 'onPlay', 'onElapsed',
			'sendSkip',
			'storeVolume', 'storeMute' );
		this.on( 'change:volume', this.storeVolume );
		this.on( 'change:mute', this.storeMute );
		this.mediator = config.mediator;
		// setup stream
		var write_stream = es.through( this.preprocessStream );
		write_stream.pipe( config.stream );
		this.stream = es.duplex( write_stream, config.stream );
		this.stream.on( 'data', this.processStream );
		// attach to instance for mocking in test
		this.store = store;
	},
	// Modify data object before sending to stream
	preprocessStream: function( data ){
		data.module = 'player';
		this.queue( data );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		if( data.module === 'player' ){
			switch( data.type ){
			case 'state':
				this.onState( data.payload );
			break;
			case 'play':
				this.onPlay( data.payload );
			break;
			case 'elapsed':
				this.onElapsed( data.payload );
			break;
			case 'order':
				this.onOrder( data.payload );
			break;
			}
		}
	},
	// act on player event from server
	onState: function( player ){
		this.set( player );
	},
	// act on load events from the server
	onPlay: function( playlist_item ){
		this.set( 'item', playlist_item );
	},
	// act on elapsed events from the server
	onElapsed: function( elapsed ){
		this.set( 'elapsed', elapsed );
	},
	// act on order events from server
	onOrder: function( order ){
		this.set( 'order', order );
	},
	// send a skip command to server
	sendSkip: function(){
		this.stream.write({
			type: 'skip'
		});
	},
	// send order to server
	sendOrder: function( order ){
		this.stream.write({
			type: 'order',
			payload: order
		});
	},
	// store volume data locally
	storeVolume: function( player, volume ){
		this.store.set( VOLUME_KEY, volume );
		this.set( 'mute', false );
	},
	// store mute state locally
	storeMute: function( player, mute ){
		this.store.set( MUTE_KEY, mute );
	}
});