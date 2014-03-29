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
		_( this ).bindAll( 'updateUnread', 'updatePlaying', 'updatePlayingFromState', 'updateVisibility', 'clearUnread' );
		this.mediator = config.mediator;
		this.socket = config.socket;
		this.listenTo( this.socket, 'player:play', this.updatePlaying );
		this.listenTo( this.socket, 'player:state', this.updatePlayingFromState );
		this.listenTo( this.socket, 'chat:message', this.updateUnread );
		Visibility.change( this.updateVisibility );
	},
	isHidden: function(){
		return Visibility.hidden();
	},
	updateUnread: function(){
		if( !this.isHidden() ) return;
		this.set( 'unread', this.get('unread') + 1 );
	},
	updatePlayingFromState: function( state ){
		this.updatePlaying( state.item );
	},
	updatePlaying: function( item ){
		// if this is from player:state, we need to select just the item
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