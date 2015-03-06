var url = require('url');
var jsonp = require('jsonp');

var SearchServerActionCreator = require('../actions/SearchServerActionCreator.js');

var SOUNDCLOUD_CLIENT_ID = tandem.bridge.apis.soundcloud.client_id;
var SOUNDCLOUD_API_HOST = 'api.soundcloud.com';

var _processSoundcloudResults = function( results ){
	var processed_results = results.map( function( result ){
		var image = ( result.artwork_url || result.user.avatar_url );
		image = image
			? image.replace('large','crop')
			: 'https://s3-us-west-1.amazonaws.com/syncmedia/images/null.png';
		var processed_result = {
			original_id: result.id,
			title: result.title,
			url: result.permalink_url,
			description: result.description,
			author: result.user.username,
			date: result.created_at,
			image: image,
			duration: result.duration / 1000,
			plays: result.playback_count,
			embeddable: result.streamable
		};
		return processed_result;
	});
	return processed_results;
};

var SoundcloudAPIUtils = {
	startSearch: function( query ){
		var search_url = url.format({
			host: SOUNDCLOUD_API_HOST,
			pathname: 'tracks.json',
			query: {
				client_id: SOUNDCLOUD_CLIENT_ID,
				filter: 'streamable',
				limit: 30,
				offset: 0,
				q: query
			}
		});
		jsonp( search_url, {}, function( err, data ){
			if( err ){
				console.log( 'SoundCloud search error', err );
				return;
			}
			var results = _processSoundcloudResults( data );
			SearchServerActionCreator.receiveResults( results, 'soundcloud' );
		});
	}
};

module.exports = SoundcloudAPIUtils;