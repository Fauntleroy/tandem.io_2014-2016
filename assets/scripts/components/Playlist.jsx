var React = require('react');
var cx = require('classnames');
var Sortable = require('react-sortable');

var secondsToTime = require('../utils/secondsToTime.js');

var PlaylistItem = require('./PlaylistItem.jsx');
var PlaylistActionCreator = require('../actions/PlaylistActionCreator.js');
var SearchActionCreator = require('../actions/SearchActionCreator.js');
var PlaylistStore = require('../stores/PlaylistStore.js');
var YoutubeAPIUtils = require('../utils/YoutubeAPIUtils.js');
var SoundcloudAPIUtils = require('../utils/SoundcloudAPIUtils.js');

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		is_remote_sorting: PlaylistStore.getIsRemoteSorting(),
		is_adding: PlaylistStore.getIsAdding(),
		items: PlaylistStore.getItems()
	}
};

var _generateItems = function( items ){
	var items_jsx = items.map( function( item ){
		return <PlaylistItem key={item.id} item={item} />
	});
	return items_jsx;
};

var Playlist = React.createClass({
	mixins: [Sortable],
	sortableOptions: {
		ref: 'items',
		model: 'items'
	},
	handleStart: function(){
		PlaylistActionCreator.sortStart();
		setTimeout( this.disableSort, 10 * 1000 );
	},
	handleEnd: function( event ){
		PlaylistActionCreator.sortEnd( event.oldIndex, event.newIndex );
	},
	getInitialState: function () {
		return _getStateFromStore()
	},
	componentDidMount: function(){
		PlaylistStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		PlaylistStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	render: function(){
		var is_remote_sorting = this.state.is_remote_sorting;
		var is_adding = this.state.is_adding;
		var items = this.state.items;
		var playlist_classes = cx({
			playlist: true,
			'playlist--is-remote-sorting': is_remote_sorting,
			'playlist--is-adding': is_adding
		});
		var playlist_duration = items.reduce( function( duration, next_item ){
			return duration + next_item.duration;
		}, 0 );
		var items_jsx = _generateItems( this.state.items );
		return (
			<div className={playlist_classes}>
				<form name="playlist_add" onSubmit={this._onAddSubmit}>
					<input
						name="url"
						type="text"
						value={this.state.url}
						placeholder="URL or search terms"
						disabled={is_adding}
						onChange={this._onUrlInputChange}
					/>
					<button type="submit" disabled={is_adding}>
						Add to Playlist <i className="fa fa-search"></i>
					</button>
					<i className="fa fa-refresh fa-spin"></i>
				</form>
				<div className="playlist_duration">
					<i className="fa fa-clock-o"></i> <var className="duration">{secondsToTime(playlist_duration)}</var>
				</div>
				<ul ref="items" className="items">
					{items_jsx}
				</ul>
			</div>
		);
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	_onUrlInputChange: function( event ){
		this.setState({
			url: event.target.value
		});
	},
	_onAddSubmit: function( event ){
		event.preventDefault();
		var url_or_query = this.state.url;
		if( YoutubeAPIUtils.testUrl( url_or_query ) ){
			PlaylistActionCreator.addItemFromUrl( url_or_query, 'youtube' );
		}
		else if( SoundcloudAPIUtils.testUrl( url_or_query ) ){
			PlaylistActionCreator.addItemFromUrl( url_or_query, 'soundcloud' );
		}
		else {
			SearchActionCreator.toggleActive( true );
			SearchActionCreator.startSearch( url_or_query );
		}
		this.setState({
			url: ''
		});
	}
});

module.exports = Playlist;
