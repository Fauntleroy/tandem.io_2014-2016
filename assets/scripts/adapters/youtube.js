var $ = require('jquery');
var _ = require('underscore');

var API_URL = 'http://gdata.youtube.com/feeds/api';
var YOUTUBE_WATCH_URL = 'http://www.youtube.com/watch?v=';
var NO_OP = function(){};

module.exports = {
	
	// get a video's data from the YouTube API
	getItem: function( query, callback ){
		callback = callback || NO_OP;
		// Turn url queries into ids
		var query_id = query.match(/youtube\.com.*[\?&]v=(.{11})|youtu\.be\/(.{11})/i);
		query_id = ( query_id )
			? query_id[1] || query_id[2] || false
			: false;
		var id = encodeURIComponent( query_id || query );
		$.ajax({
			dataType: 'jsonp',
			url: API_URL +'/videos/'+ id,
			data: {
				v: 2,
				alt: 'jsonc'
			}
		})
		.done( function( data ){
			if( data.error ) return callback( data.error.message, null );
			if( data.data.accessControl.embed != 'allowed' ) return callback( new Error('Embedding has been disabled for this video! How Stingy :('), null );
			if( data.data.category === 'Movies' ) return callback( new Error('Full movies can&apos;t be synced at this time.'), null );
			var item_data = {
				original_id: data.data.id,
				title: data.data.title,
				url: YOUTUBE_WATCH_URL + id,
				media_url: YOUTUBE_WATCH_URL + id,
				source: 'youtube',
				image: data.data.thumbnail.hqDefault,
				type: 'video',
				duration: data.data.duration,
				artist: data.data.uploader,
				artist_url: 'http://www.youtube.com/user/'+ data.data.uploader
			};
			return callback( null, item_data );
		})
		.fail( function( jqxhr, textStatus, err ){
			return callback( err, null );
		});
	},

	// search for videos
	search: function( query, params, callback ){
		callback = callback || NO_OP;
		params = params || {};
		params = _.defaults( params, {
			limit: 30,
			skip: 0
		});
		$.ajax({
			dataType: 'jsonp',
			url: API_URL +'/videos',
			data: {
				orderby: 'relevance',
				'max-results': params.limit,
				'start-index': params.skip + 1,
				q: query,
				v: 2,
				alt: 'jsonc'
			}
		})
		.done( function( data ){
			var results = _.map( data.data.items, function( item ){
				var result = {
					title: item.title,
					url: YOUTUBE_WATCH_URL + item.id,
					item_id: item.id,
					description: item.description,
					author: item.uploader,
					date: Date.parse( item.uploaded ),
					image: item.thumbnail.hqDefault,
					duration: item.duration,
					plays: item.viewCount,
					embeddable: item.accessControl.embed === 'allowed'
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