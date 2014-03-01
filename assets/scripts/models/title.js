var Backbone = require('backbone');
var _ = require('underscore');
var Visibility = require('visibilityjs/lib/visibility.core');

module.exports = Backbone.Model.extend({
	defaults: {
		title: document.title,
		unread: 0,
		playing: null
	},
	initialize: function( data, config ){
		_( this ).bindAll( 'processStream', 'updateVisibility', 'clearUnread' );
		this.mediator = config.mediator;
		this.stream = config.stream;
		this.stream.on( 'data', this.processStream );
		Visibility.change( this.updateVisibility );
	},
	// Ensures stream data is properly routed
	processStream: function( data ){
		if( data.module === 'player' ){
			switch( data.type ){
			case 'play':
				this.updatePlaying( data.payload );
			break;
			case 'state':
				this.updatePlaying( data.payload.item );
			break;
			}
		}
		else if( data.module === 'chat' ){
			switch( data.type ){
			case 'message':
				this.updateUnread();
			break;
			}
		}
	},
	isHidden: function(){
		return Visibility.hidden();
	},
	updateUnread: function(){
		if( !this.isHidden() ) return;
		this.set( 'unread', this.get('unread') + 1 );
	},
	updatePlaying: function( item ){
		this.set( 'playing', item ? item.title : null );
	},
	updateVisibility: function( e, state ){
		if( state === 'visible' ) this.clearUnread();
	},
	clearUnread: function(){
		this.set( 'unread', 0 );
	},
	getTitle: function(){
		var title_string = '';
		var unread = this.get('unread');
		var playing = this.get('playing');
		if( unread ) title_string += '('+ unread +') ';
		title_string += playing ? playing : this.get('title');
		return title_string;
	}
});