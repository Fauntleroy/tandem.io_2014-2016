const NO_OP = function(){};
const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
	name: String,
	avatar: String,
	youtube: {
		client_id: String,
		access_token: String,
		refresh_token: String,
		access_token_expiry: Number, //stored as unix timestamp
		likes_id: String
	},
	soundcloud: {
		client_id: String,
		access_token: String
		// soundcloud tokens don't expire
	}
});

// convert `_id` to `id` when converting to JSON
user_schema.set( 'toJSON', { virtuals: true });

// find and return user by auth data
// or create new user with auth data
user_schema.statics.findOrCreate = function( auth, user_data, cb ){
	cb = cb || NO_OP;
	var User = this;
	var find_params = {};
	find_params[auth.provider +'.client_id'] = auth.client_id;
	this.findOne( find_params, function( err, user ){
		// find a user and return it
		if( user ) return cb( null, user );
		// update an existing user
		if( user_data.id && user_data.id.match( MONGO_ID_REGEX ) ){
			User.findById( user_data.id, function( err, user ){
				if( err ) return cb( err, null );
				user[auth.provider] = auth;
				user.save( cb );
			});
		}
		// create a new user
		else {
			delete user_data.id;
			user_data[auth.provider] = auth;
			User.create( user_data, function( err, user ){
				if( err ) return cb( err, null );
				cb( null, user );
			});
		}
	});
};

// find user specified by `id`
// delete provider's data from db
user_schema.statics.unlinkProvider = function( user_id, provider, cb ){
	cb = cb || NO_OP;
	var User = this;
	if( !user_id.match( MONGO_ID_REGEX ) ) return cb( new Error('Invalid user ID') );
	this.findById( user_id, function( err, user ){
		if( err ) return cb( err );
		user[provider] = null;
		user.save( cb );
	});
};

// add an auth to an existing user
user_schema.methods.addAuth = function( auth ){

};

// remove an auth from an existing user
user_schema.methods.removeAuth = function( auth ){

};

var User = mongoose.model( 'User', user_schema );

module.exports = User;