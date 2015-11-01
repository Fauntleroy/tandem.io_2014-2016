import React from 'react';

import SearchSourceTab from './SearchSourceTab.jsx';

var _generateSourceTabs = function( sources ){
	var sources_jsx = sources.map( function( source ){
		return (
			<SearchSourceTab key={source.name} source={source} />
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

export default SearchSourceTabs;
