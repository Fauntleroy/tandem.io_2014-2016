var thinky = require('thinky')();
var r = thinky.r;

var NO_OP = function(){};

var User = thinky.createModel( 'User', {
	id: String,
	name: thinky.type.string().max(40),
	avatar: String,
	youtube: {
		client_id: String,
		access_token: String,
		refresh_token: String,
		access_token_expiry: Number,
		likes_id: String
	},
	soundcloud: {
		client_id: Number,
		access_token: String
	},
	created_at: thinky.type.date().default( function(){
		return new Date();
	})
});

User.ensureIndex( 'youtube_client_id', function( document ){
	return document('youtube.client_id');
});
User.ensureIndex( 'soundcloud_client_id', function( document ){
	return document('soundcloud.client_id');
});

User.defineStatic( 'updateOrCreate', function( user_data, callback ){
	callback = callback || NO_OP;
	// Figure out which client_id to search for
	var client_id_key;
	var client_id_value;
	if( user_data.youtube && user_data.youtube.client_id ){
		client_id_key = 'youtube_client_id';
		client_id_value = user_data.youtube.client_id;
	}
	else if( user_data.soundcloud && user_data.soundcloud.client_id ){
		client_id_key = 'soundcloud_client_id';
		client_id_value = user_data.soundcloud.client_id;
	}
	console.log('pre getAll');
	User.getAll( client_id_value, {
		index: client_id_key
	}).run( function( error, user ){
		console.log('pre if/else if/else');
		if( user.length > 1 ){
			console.log('user',user[0]);
			return callback( null, user[0] );
		}
		else if( user_data.id ){
			console.log('user_data.id', user_data.id);
			User.get( user_data.id ).run( function( error, user ){
				if( !user ){
					console.log('no user', user_data);
					user = new User( user_data );
				}
				else {
					console.log('user', user_data);
					user.merge( user_data ).save( callback );
				}
				user.save( callback );
			});
		}
		else {
			console.log('no user_data.id or user', user_data);
			var user = new User( user_data );
			user.save( callback );
		}
	});
});

module.exports = User;