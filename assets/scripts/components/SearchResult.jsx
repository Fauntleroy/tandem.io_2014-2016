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
		const { author, description, image, source, title, url } = result;
		const thumbnail_classes = cx({
			image: true,
			[source]: true
		});
		const thumbnail_style = {
			backgroundImage: `url(${image})`
		};
		return (
			<li>
				<span className={thumbnail_classes} style={thumbnail_style} />
				<h3 className="title"><a href={url} target="_blank">{title}</a></h3>
				<p className="description">{description}</p>
				<ul className="details">
					<li className="author">{author}</li>
				</ul>
				<button
					className="add btn btn-small btn-primary"
					alt="add"
					value={url}
					onClick={this.handleAddClick}
				>
					Add to Playlist <i className="fa fa-plus"></i>
				</button>
			</li>
		);
	}
});

export default SearchResult;
