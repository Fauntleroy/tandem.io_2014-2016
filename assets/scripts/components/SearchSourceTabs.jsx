import React, { PropTypes } from 'react';

import SearchSourceTab from './SearchSourceTab.jsx';

var SearchSourceTabs = React.createClass({
	propTypes: {
		sources: PropTypes.array.isRequired
	},
	renderSourceTabs: function(){
		return this.props.sources.map( source => {
			return <SearchSourceTab key={source.name} source={source} />;
		});
	},
	render: function(){
		return (
			<ul className="search__source-tabs">
				{this.renderSourceTabs()}
			</ul>
		);
	}
});

export default SearchSourceTabs;
