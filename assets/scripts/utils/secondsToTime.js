export default function( seconds ){
	seconds = parseInt( seconds, 10 );
	var s = parseInt( ( seconds % 60 ), 10 ).toString();
	var m = parseInt( Math.floor( ( seconds % 3600 )/ 60 ), 10 ).toString();
	var h = parseInt( Math.floor( seconds / 3600 ), 10 ).toString();
	if( s.length == 1 ) s = 0 + s;
	if( h != '0' && m.length == 1 ) m = 0 + m;
	return (h != '0')? h + ':' + m + ':' + s: m + ':' + s;
};
