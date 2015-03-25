var React = require('react');
var cx = require('classnames');
var findWhere = require('lodash/collection/findWhere');
var jwplayer = require('jwplayer');

var secondsToTime = require('../utils/secondsToTime.js');

var VolumeControl = require('./VolumeControl.jsx');
var PlayerItem = require('./PlayerItem.jsx');
var PlayerActionCreator = require('../actions/PlayerActionCreator.js');
var PlayerStore = require('../stores/PlayerStore.js');

var CHANGE_EVENT = 'change';
var CHANGE_ELAPSED_TIME_EVENT = 'change:elapsed_time';
var CHANGE_ITEM_EVENT = 'change:item';
var CHANGE_MUTE_EVENT = 'change:mute';
var CHANGE_VOLUME_EVENT = 'change:volume';
var MEDIA_TYPES = {
	youtube: 'youtube',
	soundcloud: 'mp3'
};

var _getStateFromStore = function(){
	return {
		item: PlayerStore.getItem(),
		likers: PlayerStore.getLikers(),
		client_elapsed_time: PlayerStore.getClientElapsedTime(),
		elapsed_time: PlayerStore.getElapsedTime(),
		order: PlayerStore.getOrder(),
		volume: PlayerStore.getVolume(),
		mute: PlayerStore.getMute()
	};
};

var Player = React.createClass({
	getInitialState: function(){
	    return _getStateFromStore();
	},
	componentDidMount: function(){
		PlayerStore.on( CHANGE_EVENT, this._onChange );
		PlayerStore.on( CHANGE_ELAPSED_TIME_EVENT, this._onElapsedTimeChange );
		PlayerStore.on( CHANGE_ITEM_EVENT, this._onItemChange );
		PlayerStore.on( CHANGE_MUTE_EVENT, this._onMuteChange );
		PlayerStore.on( CHANGE_VOLUME_EVENT, this._onPlayerVolumeChange );
		this._setupPlayer();
	},
	componentWillUnmount: function(){
		PlayerStore.removeListener( CHANGE_EVENT, this._onChange );
		PlayerStore.removeListener( CHANGE_ELAPSED_TIME_EVENT, this._onElapsedTimeChange );
		PlayerStore.removeListener( CHANGE_ITEM_EVENT, this._onItemChange );
		PlayerStore.removeListener( CHANGE_MUTE_EVENT, this._onMuteChange );
		PlayerStore.removeListener( CHANGE_VOLUME_EVENT, this._onPlayerVolumeChange );
		this.player.remove();
	},
	render: function(){
		var player = this.state;
		var duration = player.item
			? player.item.duration
			: 0;
		var is_liked = !!findWhere( player.likers, {
			id: tandem.bridge.user.id
		});
		var player_classes = cx({
			player: true,
			'player--empty': !player.item
		});
		var cover_style = {
			backgroundImage: ( player.item )
				? 'url('+ player.item.image +')'
				: null
		};
		var elapsed_style = {
			width: ( player.client_elapsed_time / duration ) * 100 +'%'
		};
		var like_classes = cx({
			player__controls__like: true,
			player__controls__control: true,
			'player__controls__like--liked': is_liked
		});
		var like_icon_classes = cx({
			fa: true,
			'fa-heart': is_liked,
			'fa-heart-o': !is_liked
		});
		var player_item = player.item
			? <PlayerItem item={player.item} />
			: null;
		return (
			<div className={player_classes}>
				<div className="player__media">
					<div className="player__media__empty">
						<h3 className="player__media__empty__message">
							The player is empty! Add something to the playlist below to get started.
						</h3>
					</div>
					<div className="player__media__jwplayer">
						<div id="jwplayer"></div>
					</div>
					<img className="player__media__aspect" src="/images/16x9.png" />
				</div>
				<div className="player__meta">
					<div className="player__cover" style={cover_style}></div>
					<div className="player__progress">
						<div className="player__progress__times">
							<var className="player__progress__times__elapsed">{secondsToTime(player.client_elapsed_time)}</var>
							<span className="player__progress__times__duration">{secondsToTime(duration)}</span>
						</div>
						<div className="player__progress__bars">
							<var className="player__progress__bars__elapsed" style={elapsed_style}></var>
							<span className="player__progress__bars__duration"></span>
						</div>
					</div>
					<ul className="player__controls">
						<li className="player__controls__order player__controls__control">
							<select name="order" value={player.order} onChange={this._onOrderChange}>
								<option value="fifo">Normal</option>
								<option value="shuffle">Shuffle</option>
							</select>
						</li>
						<li className="player__controls__skip player__controls__control">
							<a href="#skip" onClick={this._onSkipClick}>
								<i className="fa fa-forward"></i>
							</a>
						</li>
						<li className={like_classes}>
							<a className="player__controls__like__button" href="#like" onClick={this._onLikeClick}>
								<i className={like_icon_classes}></i>
							</a>
							<var className="player__controls__like__count">{player.likers.length || null}</var>
						</li>
						<li className="player__controls__volume player__controls__control">
							<VolumeControl
								mute={player.mute}
								volume={player.volume}
								onMute={this._onMute}
								onChange={this._onVolumeChange}
							/>
						</li>
					</ul>
					{player_item}
				</div>
			</div>
		);
	},
	_setupPlayer: function(){
		var volume = PlayerStore.getVolume();
		var mute = PlayerStore.getMute();
		this.player = jwplayer('jwplayer').setup({
			flashplayer: '/scripts/vendor/jwplayer/jwplayer.flash.swf',
			html5player: '/scripts/vendor/jwplayer/jwplayer.html5.js',
			file: 'http://www.youtube.com/watch?v=z8zFKSdm-Hs',
			controls: false
		});
		this.player.setVolume( volume );
		this.player.setMute( mute );
		this.player.onTime( this._onPlayerTime );
		this._loadItem( this.state.item );
	},
	_loadItem: function( item ){
		if( item ){
			var elapsed_time = this.state.elapsed_time;
			this.player.load({
				file: item.media_url,
				type: MEDIA_TYPES[item.source],
				image: item.image
			});
			this.player.play( true );
			this.player.seek( elapsed_time || 0 );
		} else {
			this.player.stop();
		}
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	_onElapsedTimeChange: function(){
		var elapsed_time = PlayerStore.getElapsedTime();
		var client_elapsed_time = PlayerStore.getClientElapsedTime();
		if( elapsed_time - 3 > client_elapsed_time || elapsed_time + 3 < client_elapsed_time ){
			this.player.seek( elapsed_time + 1 );
		}
	},
	_onItemChange: function(){
		var item = this.state.item;
		this._loadItem( item );
	},
	_onPlayerVolumeChange: function(){
		var volume = PlayerStore.getVolume();
		this.player.setVolume( volume );
	},
	_onMuteChange: function(){
		var mute = PlayerStore.getMute();
		this.player.setMute( mute );
	},
	_onPlayerTime: function( event ){
		var elapsed = parseInt( event.position, 10 );
		PlayerActionCreator.setElapsedTime( elapsed );
	},
	_onOrderChange: function( event ){
		event.preventDefault();
		PlayerActionCreator.setOrder( event.target.value );
	},
	_onSkipClick: function( event ){
		event.preventDefault();
		var current_item = PlayerStore.getItem();
		if( !current_item ){
			return;
		}
		if( confirm('Are you sure you want to skip this? It will be skipped for every user in the room.') ){
			PlayerActionCreator.skipItem();
		}
	},
	_onLikeClick: function( event ){
		event.preventDefault();
		PlayerActionCreator.likeItem( this.state.item );
	},
	_onMute: function( toggle ){
		PlayerActionCreator.mute( toggle );
	},
	_onVolumeChange: function( volume ){
		PlayerActionCreator.setVolume( volume );
		PlayerActionCreator.mute( false );
	}
});

module.exports = Player;