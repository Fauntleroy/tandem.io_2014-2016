/*
Adapters Module
Exposes methods for interacting with third party APIs
*/

module.exports = {
	soundcloud: require('./soundcloud.js'),
	vimeo: require('./vimeo.js'),
	youtube: require('./youtube.js')
};