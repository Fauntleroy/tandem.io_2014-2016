var React = require('react');
var throttle = require('lodash/function/throttle');
var cx = require('classnames');

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
	_calculateAndSetVolume: function( pageX ){
		var volume_level_element = this.refs.volume__level;
		var mouse_location = pageX - volume_level_element.getBoundingClientRect().left;
		var new_volume = ( mouse_location / volume_level_element.offsetWidth ) * 100;
		if( new_volume > 100 ){
			new_volume = 100;
		} else if( new_volume < 0 ){
			new_volume = 0;
		}
		this.props.onChange( new_volume );
	},
	_onMuteClick: function( event ){
		event.preventDefault();
		this.props.onMute( !this.props.mute );
	},
	_onVolumeMouseDown: function( event ){
		event.preventDefault();
		window.addEventListener( 'mousemove', this._onVolumeMouseMove );
		window.addEventListener( 'mouseup', this._onVolumeMouseUp );
		this._calculateAndSetVolume( event.pageX );
	},
	_onVolumeMouseMove: throttle( function( event ){
		event.preventDefault();
		this._calculateAndSetVolume( event.pageX );
	}, 1000 / 50 ),
	_onVolumeMouseUp: function( event ){
		this._calculateAndSetVolume( event.pageX );
		window.removeEventListener( 'mousemove', this._onVolumeMouseMove );
		window.removeEventListener( 'mouseup', this._onVolumeMouseUp );
	}
});

module.exports = VolumeControl;
