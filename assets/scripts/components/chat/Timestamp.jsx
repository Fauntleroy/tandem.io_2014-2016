import React, { PropTypes } from 'react';

const HOURS_IN_DAY = 24;
const HOURS_IN_HALF_DAY = HOURS_IN_DAY / 2;

var _generateTimestamp = function( time ){
	var hours = time.getHours();
	var hours_12 = hours % HOURS_IN_HALF_DAY || HOURS_IN_HALF_DAY;
	var am_pm = ( hours > HOURS_IN_HALF_DAY - 1 )
		? 'PM'
		: 'AM';
	var minutes_string = time.getMinutes().toString();
	if( minutes_string.length < 2 ){
		minutes_string = `0${minutes_string}`;
	}
	return `${hours_12}:${minutes_string} ${am_pm}`;
};

var Timestamp = React.createClass({
	propTypes: {
		time: PropTypes.any.isRequired
	},
	render: function(){
		var timestamp = _generateTimestamp( this.props.time );
		return (
			<time className="timestamp">{timestamp}</time>
		);
	}
});

export default Timestamp;
