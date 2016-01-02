import React from 'react';
import cx from 'classnames';

import SearchSourceTabs from './SearchSourceTabs.jsx';
import SearchResult from './SearchResult.jsx';
import SearchActionCreator from '../actions/SearchActionCreator.js';
import SearchResultsStore from '../stores/SearchResultsStore.js';

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		active: SearchResultsStore.getActive(),
		query: SearchResultsStore.getQuery(),
		sources: SearchResultsStore.getSources(),
		results: SearchResultsStore.getResultsFromActiveSource()
	};
};

var Search = React.createClass({
	getInitialState: function(){
		return _getStateFromStore();
	},
	componentDidMount: function(){
		SearchResultsStore.on( CHANGE_EVENT, this.handleChange );
	},
	componentWillUnmount: function(){
		SearchResultsStore.removeListener( CHANGE_EVENT, this.handleChange );
	},
	handleChange: function(){
		this.setState( _getStateFromStore() );
	},
	handleHideClick: function( event ){
		event.preventDefault();
		SearchActionCreator.toggleActive( false );
	},
	handleQueryInputChange: function( event ){
		this.setState({
			query: event.target.value
		});
	},
	handleQueryFormSubmit: function( event ){
		event.preventDefault();
		SearchActionCreator.startSearch( this.state.query );
	},
	handleSearch: function( query ){
		SearchActionCreator.toggleActive( true );
		SearchActionCreator.startSearch( query );
	},
	renderResults: function(){
		const results_jsx = this.state.results.map( function( result ){
			const { item_id } = result;
			return (
				<SearchResult result={result} key={item_id} />
			);
		});
		return results_jsx;
	},
	render: function(){
		var search_classes = cx({
			search: true,
			active: this.state.active
		});
		return (
			<div className={search_classes}>
				<a href="#hide" className="hide" onClick={this.handleHideClick}>
					<i className="fa fa-times"></i>
				</a>
				<form onSubmit={this.handleQueryFormSubmit}>
					<input
						name="query"
						type="text"
						value={this.state.query}
						onChange={this.handleQueryInputChange}
					/>
					<SearchSourceTabs sources={this.state.sources} />
				</form>
				<ul className="results">
					{this.renderResults()}
				</ul>
			</div>
		);
	}
});

export default Search;
