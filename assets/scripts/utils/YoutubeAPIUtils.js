var url = require('url');
var jsonp = require('jsonp');
var xhr = require('xhr');

var SearchServerActionCreator = require('../actions/SearchServerActionCreator.js');

var NO_OP = function(){};
var REQUEST_TIMEOUT = 15 * 1000;
var YOUTUBE_API_KEY = tandem.bridge.apis.youtube.api_key;
var YOUTUBE_API_HOST = 'www.googleapis.com';
var YOUTUBE_API_PATH = '/youtube/v3';
var YOUTUBE_API_PROXY_PATH = '/api/v1/proxy/youtube';
var YOUTUBE_WATCH_URL = 'http://www.youtube.com/watch?v=';

var _getIdFromUrl = function( item_url ){
	var query_id = item_url.match(/youtube\.com.*[\?&]v=(.{11})|youtu\.be\/(.{11})/i);
	query_id = ( query_id )
		? query_id[1] || query_id[2] || null
		: null;
	var id = encodeURIComponent( query_id || item_url );
	return id;
};

var _processYoutubeItem = function( item ){
	var processed_item = {
		original_id: item.id,
		title: item.title,
		url: YOUTUBE_WATCH_URL + item.id,
		media_url: YOUTUBE_WATCH_URL + item.id,
		source: 'youtube',
		image: item.thumbnail.hqDefault,
		type: 'video',
		duration: item.duration,
		artist: item.uploader,
		artist_url: 'http://www.youtube.com/user/'+ item.uploader
	};
	return processed_item;
};

var _processYoutubeResults = function( results ){
	var processed_results = results.map( function( result ){
		var processed_result = {
			title: result.snippet.title,
			url: YOUTUBE_WATCH_URL + result.id.videoId,
			item_id: result.id.videoId,
			description: result.snippet.description,
			author: result.snippet.channelTitle,
			date: Date.parse( result.snippet.publishedAt ),
			image: result.snippet.thumbnails.high.url,
			source: 'youtube'
		};
		return processed_result;
	});
	return processed_results;
};

var YoutubeAPIUtils = {
	testUrl: function( item_url ){
		return /youtube\.com.*[\?&]v=(.{11})|youtu\.be\/(.{11})/i.test( item_url );
	},
	getItemFromUrl: function( item_url, callback ){
		callback = callback || NO_OP;
		var id = _getIdFromUrl( item_url );
		var video_url = url.format({
			host: YOUTUBE_API_HOST,
			pathname: YOUTUBE_API_PATH +'/videos/'+ id,
			query: {
				v: 2,
				alt: 'jsonc'
			}
		});
		jsonp( video_url, {
			timeout: REQUEST_TIMEOUT
		}, function( error, data ){
			if( error || data.error ){
				return callback( new Error('Error getting item from YouTube') );
			}
			if( data.data.accessControl.embed != 'allowed' ){
				return callback( new Error('Embedding has been disabled for this video! How Stingy :(') );
			}
			if( data.data.category === 'Movies' ){
				return callback( new Error('Full movies can\'t be used at this time.') );
			}
			var item = _processYoutubeItem( data.data );
			return callback( null, item );
		});
	},
	startSearch: function( query ){
		var search_url = url.format({
			protocol: 'https:',
			host: YOUTUBE_API_HOST,
			pathname: YOUTUBE_API_PATH +'/search',
			query: {
				q: query,
				type: 'video',
				part: 'snippet,id',
				videoEmbeddable: true,
				order: 'relevance',
				maxResults: 30,
				key: YOUTUBE_API_KEY
			}
		});
		xhr({
			url: search_url,
			method: 'GET',
			json: true
		}, function( err, response, body ){
			if( err ){
				console.log( 'YouTube search error', err );
				return;
			}
			var results = _processYoutubeResults( body.items );
			SearchServerActionCreator.receiveResults( results, 'youtube' );
		});
	},
	likeItem: function( item_id, playlist_id, callback ){
		callback = callback || NO_OP;
		xhr({
			url: YOUTUBE_API_PROXY_PATH +'/playlistItems?part=snippet',
			method: 'POST',
			json: {
				snippet: {
					playlistId: playlist_id,
					resourceId: {
						kind: 'youtube#video',
						videoId: item_id
					},
					position: 0
				}
			}
		}, callback );
	}
};

module.exports = YoutubeAPIUtils;