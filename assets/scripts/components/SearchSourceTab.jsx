var React = require('react');
var cx = require('classnames');

var SearchActionCreator = require('../actions/SearchActionCreator.js');
var SearchResultsStore = require('../stores/SearchResultsStore.js');

var SearchSourceTab = React.createClass({
	render: function(){
		var source = this.props.source;
		var classes_object = {
			active: source.active
		};
		classes_object[source.name] = true;
		var classes = cx( classes_object );
		return (
			<li className={classes}>
				<a href={'#'+ source.name} onClick={this._onClick}>{source.display_name}</a>
			</li>
		);
	},
	_onClick: function( event ){
		event.preventDefault();
		SearchActionCreator.switchSource( this.props.source.name );
		SearchActionCreator.startSearch( SearchResultsStore.getQuery() );
	}
});

module.exports = SearchSourceTab;