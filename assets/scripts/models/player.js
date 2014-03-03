var NO_OP = function(){};
var VOLUME_KEY = 'tandem_volume';
var MUTE_KEY = 'tandem_mute';

var Backbone = require('backbone');
var _ = require('underscore');
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
		_( this ).bindAll( 'onState', 'onPlay', 'onElapsed', 'onOrder',
			'sendSkip',
			'storeVolume', 'storeMute' );
		this.mediator = config.mediator;
		this.socket = config.socket;
		// attach to instance for mocking in test
		this.store = store;
		this.on( 'change:volume', this.storeVolume );
		this.on( 'change:mute', this.storeMute );
		this.listenTo( this.socket, 'player:state', this.onState );
		this.listenTo( this.socket, 'player:play', this.onPlay );
		this.listenTo( this.socket, 'player:elapsed', this.onElapsed );
		this.listenTo( this.socket, 'player:order', this.onOrder );
	},
	// act on player event from server
	onState: function( player ){
		this.set( player );
	},
	// act on load events from the server
	onPlay: function( playlist_item ){
		this.set( 'elapsed', 0 );
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
		this.socket.emit('player:skip');
	},
	// send order to server
	sendOrder: function( order ){
		this.socket.emit( 'player:order', order );
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