var React = require('react');
var cx = require('classnames');

var SearchSourceTabs = require('./SearchSourceTabs.jsx');
var SearchResult = require('./SearchResult.jsx');
var SearchActionCreator = require('../actions/SearchActionCreator.js');
var SearchResultsStore = require('../stores/SearchResultsStore.js');

var CHANGE_EVENT = 'change';

var _getStateFromStore = function(){
	return {
		active: SearchResultsStore.getActive(),
		query: SearchResultsStore.getQuery(),
		sources: SearchResultsStore.getSources(),
		results: SearchResultsStore.getResultsFromActiveSource()
	};
};

var _generateResults = function( results ){
	var results_jsx = results.map( function( result ){
		return (
			<SearchResult result={result} />
		);
	});
	return results_jsx;
};

var Search = React.createClass({
	getInitialState: function(){
		return _getStateFromStore();
	},
	componentDidMount: function(){
		SearchResultsStore.on( CHANGE_EVENT, this._onChange );
	},
	componentWillUnmount: function(){
		SearchResultsStore.removeListener( CHANGE_EVENT, this._onChange );
	},
	render: function(){
		var search_classes = cx({
			search: true,
			active: this.state.active
		});
		var results = _generateResults.bind(this)( this.state.results );
		return (
			<div className={search_classes}>
				<a href="#hide" className="hide" onClick={this._onHideClick}>
					<i className="fa fa-times"></i>
				</a>
				<form onSubmit={this._onQueryFormSubmit}>
					<input name="query" type="text" value={this.state.query} onChange={this._onQueryInputChange} />
					<SearchSourceTabs sources={this.state.sources} />
				</form>
				<ul className="results">
					{results}
				</ul>
			</div>
		);
	},
	_onChange: function(){
		this.setState( _getStateFromStore() );
	},
	_onHideClick: function( event ){
		event.preventDefault();
		SearchActionCreator.toggleActive( false );
	},
	_onQueryInputChange: function( event ){
		this.setState({
			query: event.target.value
		});
	},
	_onQueryFormSubmit: function( event ){
		event.preventDefault();
		SearchActionCreator.startSearch( this.state.query );
	},
	_onSearch: function( query ){
		SearchActionCreator.toggleActive( true );
		SearchActionCreator.startSearch( query );
	}
});

module.exports = Search;