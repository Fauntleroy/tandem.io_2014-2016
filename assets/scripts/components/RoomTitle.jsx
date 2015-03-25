var React = require('react');
var cx = require('classnames');

var RoomActionCreator = require('../actions/RoomActionCreator.js');
var RoomStore = require('../stores/RoomStore.js');

var CHANGE_EVENT = 'change';

var RoomTitle = React.createClass({
	getInitialState: function(){
		return {
			title: RoomStore.getTitle(),
			is_editing: false
		}
	},
	componentDidMount: function(){
		RoomStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		RoomStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	render: function(){
		var title_classes = cx({
			title: true,
			'title--editing': this.state.is_editing
		});
		return (
			<form className={title_classes} onSubmit={this._onFormSubmit}>
				<h1 className="title__text">{this.state.title}</h1>
				<input className="title__input" ref="title" />
				<button className="title__edit" type="button" onClick={this._onEditClick}>
					<i className="fa fa-pencil" />
				</button>
			</form>
		);
	},
	_onChange: function(){
		this.setState({
			title: RoomStore.getTitle()
		});
	},
	_onFormSubmit: function( event ){
		event.preventDefault();
		var title_input_element = this.refs.title.getDOMNode();
		var new_title = title_input_element.value.trim();
		if( !new_title ){
			return;
		}
		RoomActionCreator.setTitle( new_title );
		this.setState({
			is_editing: false
		});
	},
	_onEditClick: function( event ){
		event.preventDefault();
		var title_input_element = this.refs.title.getDOMNode();
		title_input_element.value = this.state.title;
		setTimeout( function(){
			title_input_element.focus();
		}, 0 );
		this.setState({
			is_editing: !this.state.is_editing
		});
	}
});

module.exports = RoomTitle;