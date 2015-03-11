var React = require('react');
var throttle = require('lodash/function/throttle');
var cx = require('classnames');

var _calculateVolume = function( pageX, volume_level_element ){
	var mouse_location = pageX - volume_level_element.getBoundingClientRect().left;
	var new_volume = ( mouse_location / volume_level_element.offsetWidth ) * 100;
	if( new_volume > 100 ){
		new_volume = 100;
	} else if( new_volume < 0 ){
		new_volume = 0;
	}
	return new_volume;
};

var VolumeControl = React.createClass({
	render: function(){
		var volume_controls_classes = cx({
			'volume': true,
			'volume--muted': this.props.mute
		});
		var volume_style = {
			width: this.props.volume +'%'
		};
		return (
			<span className={volume_controls_classes}>
				<a className="volume__mute" href="#mute" onClick={this._onMuteClick}>
					<i className="volume__unmuted-icon fa fa-volume-up"></i>
					<i className="volume__muted-icon fa fa-volume-off"></i>
				</a>
				<span className="volume__level" ref="volume__level" onMouseDown={this._onVolumeMouseDown}>
					<var className="volume__level__max"></var>
					<var className="volume__level__current" style={volume_style}></var>
				</span>
			</span>
		);
	},
	_onMuteClick: function( event ){
		event.preventDefault();
		this.props.onMute( !this.props.mute );
	},
	_onVolumeMouseDown: function( event ){
		window.addEventListener( 'mousemove', this._onVolumeMouseMove );
		window.addEventListener( 'mouseup', this._onVolumeMouseUp );
	},
	_onVolumeMouseMove: throttle( function( event ){
		event.preventDefault();
		var volume_level_element = this.refs.volume__level.getDOMNode();
		var volume = _calculateVolume( event.pageX, volume_level_element );
		this.props.onChange( volume );
	}, 1000 / 60 ),
	_onVolumeMouseUp: function( event ){
		var volume_level_element = this.refs.volume__level.getDOMNode();
		var volume = _calculateVolume( event.pageX, volume_level_element );
		this.props.onChange( volume );
		window.removeEventListener( 'mousemove', this._onVolumeMouseMove );
		window.removeEventListener( 'mouseup', this._onVolumeMouseUp );
	}
});

module.exports = VolumeControl;