const NO_OP = function(){};

var Waterline = require('waterline');
var _ = require('underscore');

var User = Waterline.Collection.extend({
	identity: 'user',
	connection: 'mysql',
	attributes: {
		name: {
			type: 'string',
			size: 40
		},
		avatar: {
			type: 'string',
			size: 255
		},
		youtube_client_id: {
			type: 'string',
			index: true
		},
		youtube_access_token: {
			type: 'string'
		},
		youtube_refresh_token: {
			type: 'string'
		},
		youtube_access_token_expiry: {
			type: 'datetime'
		},
		youtube_likes_id: {
			type: 'string',
			index: true
		},
		soundcloud_client_id: {
			type: 'string'
		},
		soundcloud_access_token: {
			type: 'string'
		},

		//// instance methods
		// remove an auth strategy from an existing user
		removeAuth: function( auth_provider, cb ){
			cb = cb || NO_OP;
			// kind of nasty, but will probably replace with associations later
			switch( auth_provider ){
			case 'youtube':
				this.youtube_client_id = null;
				this.youtube_access_token = null;
				this.youtube_refresh_token = null;
				this.youtube_access_token_expiry = null;
				this.youtube_likes_id = null;
			break;
			case 'soundcloud':
				this.soundcloud_client_id = null;
				this.soundcloud_access_token = null;
			break;
			}
			this.save( cb );
		}
	},

	//// lifecycle events
	beforeCreate: function( values, next ){
		delete values.id; // delete the guest id before creating
		next();
	},

	//// class methods
	// find and update an existing user
	// or create a new user
	updateOrCreate: function( auth_data, user_data, cb ){
		cb = cb || NO_OP;
		var User = this;
		var where_params = _.pick( auth_data, function( value, key ){
			return /_client_id$/.test( key );
		});
		this
		.findOne()
		.where( where_params )
		.exec( function( err, user ){
			// user with client id already exists, return it
			if( user ){
				return cb( null, user );
			}
			// if we have a user id, update that user
			// the only ids we'll find in the db are numbers
			if( user_data.id && typeof user_data.id === 'number'){
				User
				.findOne()
				.where({ id: user_data.id })
				.exec( function( err, user ){
					if( err ){
						return cb( err );
					}
					if( !user ){
						return User.create( _.extend( user_data, auth_data ), cb );
					}
					user = _.extend( user, auth_data );
					user.save( cb );
				});
			}
			// otherwise, we're making a new user
			else {
				User.create( _.extend( user_data, auth_data ), cb );
			}
		});
	}
});

module.exports = User;