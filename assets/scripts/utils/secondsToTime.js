const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;

export default function( seconds_raw ){
	const seconds = parseInt( seconds_raw, 10 );
	var s = parseInt( ( seconds % SECONDS_IN_MINUTE ), 10 ).toString();
	var m = parseInt( Math.floor( ( seconds % SECONDS_IN_HOUR )/ MINUTES_IN_HOUR ), 10 ).toString();
	var h = parseInt( Math.floor( seconds / SECONDS_IN_HOUR ), 10 ).toString();
	if( s.length == 1 ){
		s = 0 + s;
	}
	if( h != '0' && m.length == 1 ){
		m = 0 + m;
	}
	return (h != '0')? h + ':' + m + ':' + s: m + ':' + s;
}
