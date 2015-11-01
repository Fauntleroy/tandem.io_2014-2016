import React from 'react';
import cx from 'classnames';

import secondsToTime from '../utils/secondsToTime.js';
import PlaylistActionCreator from '../actions/PlaylistActionCreator.js';
import SearchActionCreator from '../actions/SearchActionCreator.js';
import PlaylistStore from '../stores/PlaylistStore.js';
import YoutubeAPIUtils from '../utils/YoutubeAPIUtils.js';
import SoundcloudAPIUtils from '../utils/SoundcloudAPIUtils.js';

import SortableList from './sortable/List.jsx';
import SortableItem from './sortable/Item.jsx';
import PlaylistItem from './PlaylistItem.jsx';

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		is_remote_sorting: PlaylistStore.getIsRemoteSorting(),
		is_adding: PlaylistStore.getIsAdding(),
		items: PlaylistStore.getItems()
	}
};

var Playlist = React.createClass({
	getInitialState: function () {
		return _getStateFromStore();
	},
	componentDidMount: function(){
		PlaylistStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		PlaylistStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	renderItems: function(){
    const { items } = this.state;
    return items.map( ( item, i ) => {
      const { id } = item;
      return (
        <SortableItem key={id}>
          <PlaylistItem
            item={item}
            key={id}
            index={i}
          />
        </SortableItem>
      );
    });
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
				<SortableList className="items" ref="items" onSortStart={this.onSortStart} onSortEnd={this.onSortEnd}>
	        {this.renderItems()}
	      </SortableList>
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
	},
	onSortStart: function(){
		PlaylistActionCreator.sortStart();
		setTimeout( this.disableSort, 10 * 1000 );
	},
	onSortEnd: function( start, end ){
		if( start !== end ){
			PlaylistActionCreator.sortEnd( start, end );
		}
	}
});

export default Playlist;
