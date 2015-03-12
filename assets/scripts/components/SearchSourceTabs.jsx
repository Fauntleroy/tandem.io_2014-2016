var React = require('react');

var SearchSourceTab = require('./SearchSourceTab.jsx');

var _generateSourceTabs = function( sources ){
	var sources_jsx = sources.map( function( source ){
		return (
			<SearchSourceTab source={source} />
		);
	});
	return sources_jsx;
};

var SearchSourceTabs = React.createClass({
	render: function(){
		var source_tabs = _generateSourceTabs( this.props.sources );
		return (
			<ul className="providers">
				{source_tabs}
			</ul>
		);
	}
});

module.exports = SearchSourceTabs;