import React, { PropTypes } from 'react';
import cx from 'classnames';

import PlaylistActionCreator from '../actions/PlaylistActionCreator.js';

var SearchResult = React.createClass({
	propTypes: {
		result: PropTypes.shape({
			author: PropTypes.string,
			description: PropTypes.string,
			image: PropTypes.string,
			source: PropTypes.string,
			title: PropTypes.string,
			url: PropTypes.string
		})
	},
	handleAddClick: function( event ){
		event.preventDefault();
		const { result } = this.props;
		const { source, url } = result;
		PlaylistActionCreator.addItemFromUrl( url, source );
	},
	render: function(){
		const { result } = this.props;
		const { author, image, source, title, url } = result;
		const thumbnail_classes = cx({
			'search__result__image': true,
			[`search__result__image--${source}`]: true
		});
		const thumbnail_style = {
			backgroundImage: `url(${image})`
		};
		return (
			<li className="search__result">
				<div className={thumbnail_classes} style={thumbnail_style} />
				<div className="search__result__content">
					<h4 className="search__result__title"><a href={url} target="_blank">{title}</a></h4>
					<ul className="search__result__details">
						<li className="search__result__detail search__result__author">{author}</li>
					</ul>
					<button
						className="search__result__add btn btn-small btn-primary"
						alt="add"
						value={url}
						onClick={this.handleAddClick}
					>
						Add to Playlist <i className="fa fa-plus"></i>
					</button>
				</div>
			</li>
		);
	}
});

export default SearchResult;
