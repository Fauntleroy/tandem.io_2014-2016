var duration8601ToSeconds = function( duration_string ){
	var time_extractor = /(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9]*)S)?$/;
	var extracted = time_extractor.exec( duration_string );
	var hours = parseInt( extracted[1] || 0, 10 );
	var minutes = parseInt( extracted[2] || 0 , 10 );
	var seconds = parseInt( extracted[3] || 0, 10 );
	var duration = ( hours * 60 * 60 ) + ( minutes * 60 ) + seconds;
	return duration;
};

module.exports = duration8601ToSeconds;