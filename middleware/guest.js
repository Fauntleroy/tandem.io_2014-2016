const adjectives = ['Rambunctious','Punctual','Portentous','Veritable','Indecisive','Opulent','Iridescent','Magnanimous','Altruistic','Ornery','Benevolent','Apprehensive','Suspicious','Indeterminate','Vacillating','Salubrious','Deleterious','Insidious','Audacious','Loquacious','Verdant','Omnipotent','Corybantic','Virile','Petulant','Alabaster','Courteous','Corpulent','Anachronistic','Effulgent','Pulchritudinous','Accidental','Incendiary','Bioluminescent','Quantum','Raunchy','Amiable'];
const nouns = ['Gopher','Venison','Pachyderm','Cupcake','Marshmallow','Capybara','Wood Screw','Finch','Humanoid','Platelet','Chupacabra','Newt','Bees','Clownfish','Ameboid','Invertebrate','Cornucopia','Shrew','Toaster','Bunny','BRO','Gopher','Plantain','Falafel','Torte','Mealworm','Eloquence','Virtue','Bosom','Narcissism','Waffle','Cauliflower','Vim','Burp','Tree','Regret','Sock','Tortoise','Verisimilitude'];

var crypto = require('crypto');
var _ = require('underscore');
var uuid = require('node-uuid');

// generate a hash for use with gravatar
var generateUsernameHash = function( username ){
	var hash = crypto.createHash('md5');
	hash.update( username );
	var hash_string = hash.digest('hex');
	return hash_string;
};

module.exports = function( req, res, next ){
	if( !req.session ){
		return next();
	}
	var user = req.session.passport.user = req.session.passport.user || {};
	// user already has an id, so we've done this already
	if( user.id ){
		// generate an avatar url if the user exists but doesn't have one
		if( !user.avatar ){
			user.avatar = 'http://www.gravatar.com/avatar/'+ generateUsernameHash( user.name ) +'?default=retro'
			req.session.save();
		}
		return next();
	}
	var name = _.sample( adjectives ) +' '+ _.sample( nouns );
	user = _.extend( user, {
		id: uuid.v4(),
		name: name,
		avatar: 'http://www.gravatar.com/avatar/'+ generateUsernameHash( name ) +'?default=retro'
	});
	req.session.save( function(){
		next();
	});
};