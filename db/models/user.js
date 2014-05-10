var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
	name: String,
	avatar: String,
	youtube: {
		id: String,
		access_token: String,
		refresh_token: String,
		access_token_expiry: Number //stored as unix timestamp
	},
	soundcloud: {
		id: String,
		access_token: String
		// soundcloud tokens don't expire
	}
});

// add an auth to an existing user
user_schema.statics.addAuth = function( auth ){

};

// remove an auth from an existing user
user_schema.statics.removeAuth = function( auth ){

};

var User = mongoose.model( 'User', user_schema );

module.exports = User;