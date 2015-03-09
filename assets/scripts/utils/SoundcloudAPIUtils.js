var url = require('url');
var jsonp = require('jsonp');
var xhr = require('xhr');

var SearchServerActionCreator = require('../actions/SearchServerActionCreator.js');

var SOUNDCLOUD_CLIENT_ID = tandem.bridge.apis.soundcloud.client_id;
var SOUNDCLOUD_API_HOST = 'api.soundcloud.com';

var _processSoundcloudItem = function( item ){
	var stream_url = item.stream_url +'?consumer_key='+ SOUNDCLOUD_CLIENT_ID;
	// Get an image to represent this track
	// If it doesn't have artwork, use the user's avatar
	// Then make sure we get the biggest version of the image
	var image = ( item.artwork_url || item.user.avatar_url );
	image = image
		? image.replace( 'large', 'crop' )
		: 'https://s3-us-west-1.amazonaws.com/syncmedia/images/null.png';
	var processed_item = {
		original_id: item.id,
		title: item.title,
		url: url,
		media_url: stream_url,
		source: 'soundcloud',
		image: image,
		type: 'audio',
		duration: parseInt( ( item.duration / 1000 ), 10 ),
		artist: item.user.username,
		artist_url: item.user.permalink_url
	};
	return processed_item;
};

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
	testUrl: function( url ){
		return /.*soundcloud\.com\/.*/i.test( url );
	},
	getItemFromUrl: function( item_url, callback ){
		var resolve_url = url.format({
			host: SOUNDCLOUD_API_HOST,
			pathname: 'resolve.json',
			query: {
				client_id: SOUNDCLOUD_CLIENT_ID,
				url: item_url
			}
		});
		jsonp( resolve_url, {}, function( err, data ){
			if( err ){
				alert('Error resolving url with SoundCloud.');
				return;
			}
			if( !data.streamable ){
				alert('Streaming has been disabled for this track! Nooo :(');
				return;
			}
			var item = _processSoundcloudItem( data );
			// Unfortunately, the SoundCloud API can't be trusted, so stream_urls have to be validated
			xhr({
				method: 'HEAD',
				url: item.media_url
			}, function( err ){
				if( err ){
					alert('Stream URL not found. This is a problem with the SoundCloud API.');
					return;
				}
				if( callback ){
					callback( null, item );
				}
			});
		});
	},
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
				alert('SoundCloud search error');
				return;
			}
			var results = _processSoundcloudResults( data );
			SearchServerActionCreator.receiveResults( results, 'soundcloud' );
		});
	}
};

module.exports = SoundcloudAPIUtils;