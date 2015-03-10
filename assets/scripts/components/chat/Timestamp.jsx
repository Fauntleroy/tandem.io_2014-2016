var React = require('react');

var Timestamp = React.createClass({
	render: function(){
		var timestamp = this.props.timestamp;
		return (
			<time className="timestamp">{timestamp}</time>
		);
	}
});

module.exports = Timestamp;