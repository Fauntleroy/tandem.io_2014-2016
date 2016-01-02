const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

var duration8601ToSeconds = function( duration_string ){
	var time_extractor = /(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9]*)S)?$/;
	var extracted = time_extractor.exec( duration_string );
	var hours = parseInt( extracted[1] || 0 );
	var minutes = parseInt( extracted[2] || 0 );
	var seconds = parseInt( extracted[3] || 0 );
	var duration = ( hours * MINUTES_IN_HOUR * SECONDS_IN_MINUTE ) + ( minutes * SECONDS_IN_MINUTE ) + seconds;
	return duration;
};

export default duration8601ToSeconds;
