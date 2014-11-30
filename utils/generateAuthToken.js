const TOKEN_SECRET = process.env.TANDEM_TOKEN_SECRET;

var crypto = require('crypto');

// generate auth token for use with streaming endpoints
// pass any data we need attached to message objects
module.exports = function( id, name, avatar ){
	if( !id ) return new Error('id must be defined');
	if( !name ) return new Error('name must be defined');
	if( !avatar ) return new Error('avatar must be defined');
	var hmac = crypto.createHmac( 'sha256', TOKEN_SECRET );
	hmac.setEncoding('hex');
	hmac.write( id.toString() ); // "registered" users have numerical ids
	hmac.write( name );
	hmac.write( avatar );
	hmac.end();
	return hmac.read();
};
