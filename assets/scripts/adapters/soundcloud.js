var $ = require('jquery');
var _ = require('underscore');

var API_URL = 'http://api.soundcloud.com';
var SOUNDCLOUD_CLIENT_ID = tandem.bridge.apis.soundcloud.client_id;
var NO_OP = function(){};

module.exports = {
	
	// get a track's data from its URL
	getItem: function( url, callback ){
		callback = callback || NO_OP;
		if( ! /.*soundcloud\.com\/.*/i.test( url ) ){
			return callback( new Error('Invalid SoundCloud URL'), null );
		}
		$.ajax({
			dataType: 'jsonp',
			url: API_URL +'/resolve.json',
			data: {
				client_id: SOUNDCLOUD_CLIENT_ID,
				url: url
			}
		})
		.done( function( data ){
			if( !data.streamable ) return callback( new Error('Streaming has been disabled for this track! Nooo :('), null );
			var image = ( data.artwork_url || data.user.avatar_url );
			image = image? image.replace('large','crop'): 'https://s3-us-west-1.amazonaws.com/syncmedia/images/null.png';
			var stream_url = data.stream_url +'?consumer_key='+ SOUNDCLOUD_CLIENT_ID
			var item_data = {
				title: data.title,
				url: url,
				media_url: stream_url,
				source: 'soundcloud',
				image: image,
				type: 'audio',
				duration: parseInt( ( data.duration / 1000 ), 10 ),
				artist: data.user.username,
				artist_url: data.user.permalink_url
			};
			// check to see if the stream_url really exists
			$.ajax({
				type: 'HEAD',
				url: stream_url
			})
			.done( function(){
				return callback( null, item_data );
			})
			.fail( function(){
				return callback( new Error('Stream URL not found. This is a problem with the SoundCloud API.'), null );
			});
		})
		.fail( function( jqxhr, textStatus, err ){
			return callback( err, null );
		});
		
	},

	// search for tracks
	search: function( query, params, callback ){
		callback = callback || NO_OP;
		params = params || {};
		params = _.defaults( params, {
			limit: 30,
			skip: 0
		});
		$.ajax({
			dataType: 'jsonp',
			url: API_URL +'/tracks.json',
			data: {
				client_id: SOUNDCLOUD_CLIENT_ID,
				filter: 'streamable',
				limit: params.limit,
				offset: params.skip,
				q: query
			}
		})
		.done( function( data ){
			console.log('sc search data', data);
			var results = _.map( data, function( item ){
				var image = ( item.artwork_url || item.user.avatar_url );
				image = image
					? image.replace('large','crop')
					: 'https://s3-us-west-1.amazonaws.com/syncmedia/images/null.png';
				var result = {
					title: item.title,
					url: item.permalink_url,
					description: item.description,
					author: item.user.username,
					date: item.created_at,
					image: image,
					duration: item.duration / 1000,
					plays: item.playback_count,
					embeddable: item.streamable
				};
				return result;
			});
			return callback( null, results );
		})
		.fail( function( jqxhr, textStatus, err ){
			return callback( err, null );
		});
		
	}
	
};