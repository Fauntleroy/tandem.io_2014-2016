import React from 'react';
import cx from 'classnames';
import findWhere from 'lodash/collection/findWhere';

import secondsToTime from '../utils/secondsToTime.js';

import ReactPlayer from 'react-player';
import VolumeControl from './VolumeControl.jsx';
import PlayerItem from './PlayerItem.jsx';
import PlayerActionCreator from '../actions/PlayerActionCreator.js';
import PlayerStore from '../stores/PlayerStore.js';

const CHANGE_EVENT = 'change';
const CHANGE_ELAPSED_TIME_EVENT = 'change:elapsed_time';
const SOUNDCLOUD_CONFIG = {
	clientId: tandem.bridge.apis.soundcloud.client_id
};
const YOUTUBE_CONFIG = {
	playerVars: {
		autoplay: 1,
		rel: 0
	},
	preload: true
};
const MAXIMUM_PLAYER_ELAPSED_DRIFT = 3;
const MAXIMUM_VOLUME = 100;

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
		PlayerStore.on( CHANGE_EVENT, this.handleChange );
		PlayerStore.on( CHANGE_ELAPSED_TIME_EVENT, this.handleElapsedTimeChange );
	},
	componentWillUnmount: function(){
		PlayerStore.removeListener( CHANGE_EVENT, this.handleChange );
		PlayerStore.removeListener( CHANGE_ELAPSED_TIME_EVENT, this.handleElapsedTimeChange );
	},
	handleChange: function(){
		this.setState( _getStateFromStore() );
	},
	handleElapsedTimeChange: function(){
		var elapsed_time = this.state.elapsed_time;
		var client_elapsed_time = this.state.client_elapsed_time;
		if( elapsed_time - MAXIMUM_PLAYER_ELAPSED_DRIFT > client_elapsed_time || elapsed_time + MAXIMUM_PLAYER_ELAPSED_DRIFT < client_elapsed_time ){
			this.refs.player.seekTo(this.state.elapsed_time / this.state.item.duration);
		}
	},
	handlePlayerTime: function( progress ){
		// TODO figure out what's actually going on with these conflicting dispatches
		if (progress.played === 0) {
			return;
		}
		var elapsed_time = parseInt( progress.played * this.state.item.duration );
		PlayerActionCreator.setElapsedTime( elapsed_time );
	},
	handleOrderChange: function( event ){
		event.preventDefault();
		PlayerActionCreator.setOrder( event.target.value );
	},
	handleSkipClick: function( event ){
		event.preventDefault();
		var current_item = PlayerStore.getItem();
		if( !current_item ){
			return;
		}
		if( confirm('Are you sure you want to skip this? It will be skipped for every user in the room.') ){
			PlayerActionCreator.skipItem();
		}
	},
	handleLikeClick: function( event ){
		event.preventDefault();
		PlayerActionCreator.likeItem( this.state.item );
	},
	handleMute: function( toggle ){
		PlayerActionCreator.mute( toggle );
	},
	handleVolumeChange: function( volume ){
		PlayerActionCreator.setVolume( volume );
		PlayerActionCreator.mute( false );
	},
	render: function(){
		var player = this.state;
		var duration = player.item
			? player.item.duration
			: 0;
		var is_liked = !!findWhere( player.likers, {
			id: tandem.bridge.user.id
		});
		var volume = this.state.mute
			? 0
			: this.state.volume / MAXIMUM_VOLUME;
		var media_url = player.item
			? player.item.source === 'soundcloud'
				? player.item.url
				: player.item.media_url
			: null;
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
			width: ( player.client_elapsed_time / duration ) * MAXIMUM_VOLUME +'%'
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
						<ReactPlayer
							ref="player"
							url={media_url}
							volume={volume}
							playing={true}
							soundcloudConfig={SOUNDCLOUD_CONFIG}
							youtubeConfig={YOUTUBE_CONFIG}
							onProgress={this.handlePlayerTime}
						/>
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
							<select name="order" value={player.order} onChange={this.handleOrderChange}>
								<option value="fifo">Normal</option>
								<option value="shuffle">Shuffle</option>
							</select>
						</li>
						<li className="player__controls__skip player__controls__control">
							<a href="#skip" onClick={this.handleSkipClick}>
								<i className="fa fa-forward"></i>
							</a>
						</li>
						<li className={like_classes}>
							<a className="player__controls__like__button" href="#like" onClick={this.handleLikeClick}>
								<i className={like_icon_classes}></i>
							</a>
							<var className="player__controls__like__count">{player.likers.length || null}</var>
						</li>
						<li className="player__controls__volume player__controls__control">
							<VolumeControl
								mute={player.mute}
								volume={player.volume}
								onMute={this.handleMute}
								onChange={this.handleVolumeChange}
							/>
						</li>
					</ul>
					{player_item}
				</div>
			</div>
		);
	}
});

export default Player;
