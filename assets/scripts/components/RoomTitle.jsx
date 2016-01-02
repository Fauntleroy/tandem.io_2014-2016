import React from 'react';
import cx from 'classnames';

import RoomActionCreator from '../actions/RoomActionCreator.js';
import RoomStore from '../stores/RoomStore.js';

var CHANGE_EVENT = 'change';

var RoomTitle = React.createClass({
	getInitialState: function(){
		return {
			title: RoomStore.getTitle(),
			is_editing: false
		};
	},
	componentDidMount: function(){
		RoomStore.on( CHANGE_EVENT, this.handleChange );
	},
	componentWillUnmount: function(){
		RoomStore.removeListener( CHANGE_EVENT, this.handleChange );
	},
	handleChange: function(){
		this.setState({
			title: RoomStore.getTitle()
		});
	},
	handleFormSubmit: function( event ){
		event.preventDefault();
		var title_input_element = this.refs.title;
		var new_title = title_input_element.value.trim();
		if( !new_title ){
			return;
		}
		RoomActionCreator.setTitle( new_title );
		this.setState({
			is_editing: false
		});
	},
	handleEditClick: function( event ){
		event.preventDefault();
		var title_input_element = this.refs.title;
		title_input_element.value = this.state.title;
		setTimeout( () => {
			title_input_element.focus();
		}, 0 );
		this.setState({
			is_editing: !this.state.is_editing
		});
	},
	render: function(){
		var title_classes = cx({
			title: true,
			'title--editing': this.state.is_editing
		});
		return (
			<form className={title_classes} onSubmit={this.handleFormSubmit}>
				<h1 className="title__text">{this.state.title}</h1>
				<input className="title__input" ref="title" />
				<button className="title__edit" type="button" onClick={this.handleEditClick}>
					<i className="fa fa-pencil" />
				</button>
			</form>
		);
	}
});

export default RoomTitle;
