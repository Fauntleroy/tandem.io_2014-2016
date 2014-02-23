var $ = require('jquery');

module.exports = {
	
	getItem: function( query, callback ){
		// Turn url queries into ids
		var query_id = query.match(/vimeo\.com\/([0-9]*)/);
		query_id = ( query_id )
			? query_id[1] || false
			: false;
		var id = query_id || query;
		var json_url = 'http://vimeo.com/api/v2/video/'+ id +'.json?callback=?';

		$.getJSON( json_url, function( data ){
			var item_data = {
				title: data[0].title,
				url: data[0].url,
				media_url: data[0].url,
				source: 'vimeo',
				image: data[0].thumbnail_large,
				duration: data[0].duration,
				type: 'video',
				artist: data[0].user_name,
				artist_url: data[0].user_url
			};
			callback( null, item_data );
		});
	}
	
};