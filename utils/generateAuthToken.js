const TOKEN_SECRET = process.env.TANDEM_TOKEN_SECRET;

var crypto = require('crypto');

// generate auth token for use with streaming endpoints
// pass any data we need attached to message objects
module.exports = function( id, name ){
	var hmac = crypto.createHmac( 'sha256', TOKEN_SECRET );
	hmac.setEncoding('hex');
	hmac.write( id );
	hmac.write( name );
	hmac.end();
	return hmac.read();
};