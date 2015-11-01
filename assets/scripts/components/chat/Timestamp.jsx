import React from 'react';

var _generateTimestamp = function( time ){
	var hours = time.getHours();
	var hours_12 = hours % 12 || 12;
	var am_pm = ( hours > 11 )
		? 'PM'
		: 'AM';
	var minutes_string = time.getMinutes().toString();
	if( minutes_string.length < 2 ){
		minutes_string = '0'+ minutes_string;
	}
	return hours_12 +':'+ minutes_string +' '+ am_pm;
};

var Timestamp = React.createClass({
	render: function(){
		var timestamp = _generateTimestamp( this.props.time );
		return (
			<time className="timestamp">{timestamp}</time>
		);
	}
});

export default Timestamp;
