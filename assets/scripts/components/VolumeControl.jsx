import React, { PropTypes } from 'react';
import throttle from 'lodash/function/throttle';
import cx from 'classnames';

const MAXIMUM_VOLUME = 100;
const MAXIMUM_MOUSEMOVES_PER_SECOND = 50;

var VolumeControl = React.createClass({
	propTypes: {
		mute: PropTypes.bool,
		volume: PropTypes.number,
		onChange: PropTypes.func,
		onMute: PropTypes.func
	},
	_calculateAndSetVolume: function( pageX ){
		var volume_level_element = this.refs.volume__level;
		var mouse_location = pageX - volume_level_element.getBoundingClientRect().left;
		var new_volume = ( mouse_location / volume_level_element.offsetWidth ) * MAXIMUM_VOLUME;
		if( new_volume > MAXIMUM_VOLUME ){
			new_volume = MAXIMUM_VOLUME;
		} else if( new_volume < 0 ){
			new_volume = 0;
		}
		this.props.onChange( new_volume );
	},
	handleMuteClick: function( event ){
		event.preventDefault();
		this.props.onMute( !this.props.mute );
	},
	handleVolumeMouseDown: function( event ){
		event.preventDefault();
		window.addEventListener( 'mousemove', this.handleVolumeMouseMove );
		window.addEventListener( 'mouseup', this.handleVolumeMouseUp );
		this._calculateAndSetVolume( event.pageX );
	},
	handleVolumeMouseMove: throttle( function( event ){
		event.preventDefault();
		this._calculateAndSetVolume( event.pageX );
	}, 1000 / MAXIMUM_MOUSEMOVES_PER_SECOND ),
	handleVolumeMouseUp: function( event ){
		this._calculateAndSetVolume( event.pageX );
		window.removeEventListener( 'mousemove', this.handleVolumeMouseMove );
		window.removeEventListener( 'mouseup', this.handleVolumeMouseUp );
	},
	render: function(){
		const { mute, volume } = this.props;
		const volume_controls_classes = cx({
			'volume': true,
			'volume--muted': mute
		});
		const volume_style = {
			width: volume +'%'
		};
		return (
			<span className={volume_controls_classes}>
				<a className="volume__mute" href="#mute" onClick={this.handleMuteClick}>
					<i className="volume__unmuted-icon fa fa-volume-up"></i>
					<i className="volume__muted-icon fa fa-volume-off"></i>
				</a>
				<span className="volume__level" ref="volume__level" onMouseDown={this.handleVolumeMouseDown}>
					<var className="volume__level__max"></var>
					<var className="volume__level__current" style={volume_style}></var>
				</span>
			</span>
		);
	}
});

export default VolumeControl;
