import React, { PropTypes } from 'react';
import cx from 'classnames';

import SearchActionCreator from '../actions/SearchActionCreator.js';
import SearchResultsStore from '../stores/SearchResultsStore.js';

var SearchSourceTab = React.createClass({
	propTypes: {
		source: PropTypes.shape({
			active: PropTypes.bool,
			display_name: PropTypes.string,
			name: PropTypes.string
		})
	},
	handleClick: function( event ){
		event.preventDefault();
		SearchActionCreator.switchSource( this.props.source.name );
		SearchActionCreator.startSearch( SearchResultsStore.getQuery() );
	},
	render: function(){
		const { source } = this.props;
		const { active, display_name, name } = source;
		const classes = cx({
			'search__source-tab': true,
			'search__source-tab--active': active,
			[`search__source-tab--${name}`]: true
		});
		return (
			<li className={classes}>
				<a className="search__source-tab__link" href={`#${name}`} onClick={this.handleClick}>{display_name}</a>
			</li>
		);
	}
});

export default SearchSourceTab;
