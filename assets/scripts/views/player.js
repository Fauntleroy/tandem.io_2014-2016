var MEDIA_TYPES = {
	youtube: 'youtube',
	soundcloud: 'mp3'
};

var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var _ = require('underscore');
var Handlebars = require('hbsfy/runtime');
var handlebars_helper = require('handlebars-helper');
handlebars_helper.help( Handlebars );
var jwplayer = require('jwplayer');

var secondsToTime = require('../utils/secondsToTime.js');
var player_template = require('../../templates/player.hbs');
var player_item_template = require('../../templates/player_item.hbs');

module.exports = Backbone.View.extend({
	events: {
		'click li.skip a': 'clickSkip',
		'click li.like a': 'clickLike',
		'change li.order select': 'changeOrder',
		'click li.volume a[href="#mute"]': 'clickMute',
		'mousedown li.volume .level': 'mousedownVolume'
	},
	initialize: function(){
		_( this ).bindAll( 'render', 'renderElapsed', 'renderOrder', 'renderItem', 'renderMute', 'renderVolume',
			'clickSkip', 'clickLike', 'changeOrder', 'clickMute', 'mousedownVolume', 'mousemoveVolume', 'mouseupVolume',
			'calculateVolume', 'checkSync' );
		this.render();
		this.listenTo( this.model, 'change:elapsed', this.checkSync );
		this.listenTo( this.model, 'change:likers', this.renderLikers );
		this.listenTo( this.model, 'change:order', this.renderOrder );
		this.listenTo( this.model, 'change:item', this.renderItem );
		this.listenTo( this.model, 'change:volume', this.renderVolume );
		this.listenTo( this.model, 'change:mute', this.renderMute );
	},
	render: function(){
		this.$window = $(window);
		this.$el.html( player_template( this.model.toJSON() ) );
		this.$players = this.$el.find('#players');
		this.$progress = this.$el.find('div.progress');
		this.$elapsed = this.$progress.children('var.elapsed');
		this.$duration = this.$progress.children('span.duration');
		this.$elapsed_bar = this.$progress.find('div.bars var.elapsed');
		this.$duration_bar = this.$progress.find('div.bars span.duration');
		this.$controls = this.$el.find('ul.controls');
		this.$skip = this.$controls.find('li.skip a');
		this.$like = this.$controls.find('li.like a');
		this.$like_heart = this.$like.find('i');
		this.$likes = this.$controls.find('li.like .likes');
		this.$order = this.$controls.find('li.order select[name="order"]');
		this.$volume = this.$controls.find('li.volume');
		this.$mute = this.$volume.find('a[href="#mute"]');
		this.$volume_level = this.$volume.find('.level');
		this.$volume_bar = this.$volume_level.children('var');
		this.$item = this.$el.find('div.item');
		this.player = jwplayer('jwplayer').setup({
			flashplayer: '/scripts/vendor/jwplayer/jwplayer.flash.swf',
			html5player: '/scripts/vendor/jwplayer/jwplayer.html5.js',
			file: 'http://www.youtube.com/watch?v=z8zFKSdm-Hs', // I'd love to not load anything...
			controls: false
		});
		this.player.onTime( this.renderElapsed );
	},
	// render elapsed time
	renderElapsed: function( e ){
		var elapsed = parseInt( e.position, 10 );
		this.$elapsed.text( secondsToTime( elapsed ) );
		this.$elapsed_bar.css( 'width', ( ( e.position / e.duration ) * 100 ) +'%' );
	},
	// render current item's likes
	renderLikers: function( player, likers ){
		this.$likes.text( likers.length );
		var is_liked = !!_.findWhere( likers, { id: this.model.user.id });
		this.$like_heart
		.toggleClass( 'fa-heart', is_liked )
		.toggleClass( 'fa-heart-o', !is_liked );
	},
	// render player order
	renderOrder: function( player, order ){
		this.$order.children('option[value='+ order +']').prop( 'selected', true );
	},
	// render item
	renderItem: function( player, item ){
		if( item ){
			this.$progress.show();
			this.$item.html( player_item_template( item ) );
			this.$duration.text( secondsToTime( item.duration ) );
			this.player.load({
				file: item.media_url,
				type: MEDIA_TYPES[item.source],
				image: item.image
			});
			var elapsed = this.model.get('elapsed');
			this.player.play( true );
			this.player.seek( elapsed || 0 );
		} else {
			this.$item.html('');
			this.$progress.hide();
			this.$duration.text('');
			this.player.stop();
		}
	},
	// update player mute states when player model's mute state changes
	renderMute: function( model, mute ){
		this.$mute.children('span').text( mute ? 'Unmute' : 'Mute' );
		this.$volume.toggleClass( 'muted', mute );
		this.player.setMute( mute );
	},
	// update player volumes when player model's volume changes
	renderVolume: function( model, volume ){
		this.$volume_bar.width( volume +'%' );
		this.player.setVolume( volume );
	},
	// skip the current item
	clickSkip: function( e ){
		e.preventDefault();
		this.model.sendSkip( function( err ){
			if( err ) alert( err );
		});
	},
	// like the current item
	clickLike: function( e ){
		e.preventDefault();
		this.model.sendLike( function( err ){
			if( err ) alert( err );
		});
	},
	// modify player order
	changeOrder: function( e ){
		var order = this.$order.val();
		this.model.sendOrder( order );
	},
	// update player mute state
	clickMute: function( e ){
		e.preventDefault();
		var mute = this.model.get('mute');
		this.model.set( 'mute', !mute );
	},
	// use these three methods for volume control
	mousedownVolume: function( e ){
		e.preventDefault();
		this.$window.on({
			'mousemove.volume': this.mousemoveVolume,
			'mouseup.volume': this.mouseupVolume
		});
	},
	mousemoveVolume: function( e ){
		e.preventDefault();
		this.model.set( 'volume', this.calculateVolume( e ) );
	},
	mouseupVolume: function( e ){
		e.preventDefault();
		this.model.set( 'volume', this.calculateVolume( e ) );
		this.$window.off('.volume');
	},
	calculateVolume: function( e ){
		var mouse_location = e.pageX - this.$volume_level.offset().left;
		var new_volume = ( mouse_location / this.$volume_level.width() ) * 100;
		if( new_volume > 100 ) new_volume = 100;
		if( new_volume < 0 ) new_volume = 0;
		return new_volume;
	},
	// ensure local player is synced with the server
	checkSync: function( player, elapsed ){
		var current_time = parseInt( this.player.getPosition() );
		if( elapsed - 3 > current_time || elapsed + 3 < current_time ){
			this.player.seek( elapsed + 1 );
		}
	}
});