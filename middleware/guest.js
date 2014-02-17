const adjectives = ['Rambunctious','Punctual','Portentous','Veritable','Indecisive','Opulent','Iridescent','Magnanimous','Altruistic','Ornery','Benevolent','Apprehensive','Suspicious','Indeterminate','Vacillating','Salubrious','Deleterious','Insidious','Audacious','Loquacious','Verdant','Omnipotent','Corybantic','Virile','Petulant','Alabaster','Courteous','Corpulent','Anachronistic','Effulgent','Pulchritudinous','Accidental','Incendiary','Bioluminescent','Quantum','Raunchy','Amiable'];
const nouns = ['Gopher','Venison','Pachyderm','Cupcake','Marshmallow','Capybara','Wood Screw','Finch','Humanoid','Platelet','Chupacabra','Newt','Bees','Clownfish','Ameboid','Invertebrate','Cornucopia','Shrew','Toaster','Bunny','BRO','Gopher','Plantain','Falafel','Torte','Mealworm','Eloquence','Virtue','Bosom','Narcissism','Waffle','Cauliflower','Vim','Burp','Tree','Regret','Sock','Tortoise','Verisimilitude'];

var _ = require('underscore');
var uuid = require('node-uuid');

module.exports = function( req, res, next ){
	var user = req.session.passport.user = req.session.passport.user || {};
	// user already has an id, so we've done this already
	if( user.id ) return next();
	user = _.extend( user, {
		id: uuid.v4(),
		name: _.sample( adjectives ) +' '+ _.sample( nouns )
	});
	req.session.save( function(){
		next();
	});
};