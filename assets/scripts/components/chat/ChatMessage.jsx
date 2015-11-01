import React from 'react';
import cx from 'classnames';

import User from '../User.jsx';
import Timestamp from './Timestamp.jsx';

// from https://github.com/medialize/URI.js/blob/0cd4b1f09c7367d86e51731e692c3d20111f2681/src/URI.js#L191
var url_regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

var _linkify = function( text ) {
	// using split with this regex results in lots of extra undefineds, which are skipped later
	// TODO this is horrible and should be refactored
	var split_strings = text.split( url_regex );
	var linkified_jsx = [];
	split_strings.forEach( function( string ){
		if( string ){
			if( url_regex.test( string ) ){
				linkified_jsx.push( <a href={string} target="_blank">{string}</a> );
			}
			else {
				linkified_jsx.push( string );
			}
		}
	});
	return linkified_jsx;
}

var _generateContent = function( content_array ){
	return content_array.map( function( content ){
		const { text, uuid } = content;
		content = _linkify( text );
		return <p key={uuid}>{text}</p>;
	});
};

var ChatMessage = React.createClass({
	render: function(){
		var message = this.props.message;
		var li_classes = cx({
			chat: true,
			self: ( message.user.id === tandem.bridge.user.id )
		});
		var content_jsx = _generateContent( message.content );
		return (
			<li className={li_classes}>
				<div className="content">
					{content_jsx}
				</div>
				<User user={message.user} />
				<Timestamp time={message.time} />
			</li>
		);
	}
});

export default ChatMessage;
