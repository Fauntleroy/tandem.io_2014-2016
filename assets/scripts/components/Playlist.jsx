var React = require('react');
var cx = require('classnames');
var assign = require('lodash/object/assign')
var indexOf = Array.prototype.indexOf;

var secondsToTime = require('../utils/secondsToTime.js');

var PlaylistItem = require('./PlaylistItem.jsx');
var PlaylistActionCreator = require('../actions/PlaylistActionCreator.js');
var SearchActionCreator = require('../actions/SearchActionCreator.js');
var PlaylistStore = require('../stores/PlaylistStore.js');
var YoutubeAPIUtils = require('../utils/YoutubeAPIUtils.js');
var SoundcloudAPIUtils = require('../utils/SoundcloudAPIUtils.js');

var CHANGE_EVENT = 'change';

var _move = function( array, origin, destination ){
	var element_to_move = array.splice( origin, 1 )[0];
	array.splice( destination, 0, element_to_move );
};

var _getChildIndexViaEventTarget = function( parent, target ){
	for( var i = 0; i < parent.children.length; i++ ){
		if( parent.children[i].contains( target ) ){
			return i;
		}
	}
	return -1;
};

var _getStateFromStore = function(){
	return {
		is_adding: PlaylistStore.getIsAdding(),
		items: PlaylistStore.getItems()
	}
};

var Playlist = React.createClass({
	getInitialState: function(){
		return _getStateFromStore();
	},
	componentDidMount: function(){
		PlaylistStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		PlaylistStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	render: function(){
		var is_adding = this.state.is_adding;
		var items = this.state.items;
		var playlist_add_form_classes = cx({
			submitting: is_adding
		});
		var playlist_duration = items.reduce( function( duration, next_item ){
			return duration + next_item.duration;
		}, 0 );
		var items_jsx = this._generateItems( this.state.items );
		return (
			<div className="playlist">
				<form name="playlist_add" className={playlist_add_form_classes} onSubmit={this._onAddSubmit}>
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
				<ul className="items" onDragOver={this._onDragOver}>
					{items_jsx}
				</ul>
			</div>
		);
	},
	_generateItems: function( items ){
		var _this = this;
		var items_jsx = items.map( function( item, i ){
			var sort_before = false;
			var sort_after = false;
			if( _this.state._sort_destination === i ){
				var sort_before = ( _this.state._sort_destination < _this.state._sort_origin );
				var sort_after = ( _this.state._sort_destination > _this.state._sort_origin );
			}
			return (
				<PlaylistItem
					key={item.id}
					item={item}
					onDragStart={_this._onItemDragStart}
					onDragEnd={_this._onItemDragEnd}
					sort_before={sort_before}
					sort_after={sort_after}
				/>
			);
		});
		return items_jsx;
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
	// Drag events
	_onItemDragStart: function( event ){
		event.dataTransfer.setData("text/html", event.currentTarget);
		this.setState({
			_sort_origin: indexOf.call( event.target.parentElement.children, event.target )
		});
	},
	_onItemDragEnd: function( event ){
		_move( this.state.items, this.state._sort_origin, this.state._sort_destination );
		this.setState({
			_sort_origin: null,
			_sort_destination: null,
			items: this.state.items
		});
	},
	_onDragOver: function( event ){
		event.preventDefault();
		var child_index = _getChildIndexViaEventTarget( event.currentTarget, event.target );
		if( child_index >= 0 ){
			this.setState({
				_sort_destination: child_index
			});
		}
	}
});

module.exports = Playlist;