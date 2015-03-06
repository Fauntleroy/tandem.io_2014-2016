var url = require('url');
var jsonp = require('jsonp');

var SearchServerActionCreator = require('../actions/SearchServerActionCreator.js');

var YOUTUBE_API_HOST = 'gdata.youtube.com';
var YOUTUBE_API_PATH = '/feeds/api';
var YOUTUBE_WATCH_URL = 'http://www.youtube.com/watch?v=';

var _processYoutubeResults = function( results ){
	var processed_results = results.map( function( result ){
		var processed_result = {
			title: result.title,
			url: YOUTUBE_WATCH_URL + result.id,
			item_id: result.id,
			description: result.description,
			author: result.uploader,
			date: Date.parse( result.uploaded ),
			image: result.thumbnail.hqDefault,
			duration: result.duration,
			plays: result.viewCount,
			embeddable: result.accessControl.embed === 'allowed'
		};
		return processed_result;
	});
	return processed_results;
};

var YoutubeAPIUtils = {
	startSearch: function( query ){
		var search_url = url.format({
			host: YOUTUBE_API_HOST,
			pathname: YOUTUBE_API_PATH +'/videos',
			query: {
				orderby: 'relevance',
				'max-results': 30,
				'start-index': 0 + 1,
				q: query,
				v: 2,
				alt: 'jsonc'
			}
		});
		jsonp( search_url, {}, function( err, data ){
			if( err ){
				console.log( 'YouTube search error', err );
				return;
			}
			var results = _processYoutubeResults( data.data.items );
			SearchServerActionCreator.receiveResults( results, 'youtube' );
		});
	}
};

module.exports = YoutubeAPIUtils;