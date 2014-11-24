const adjectives = ['Rambunctious','Punctual','Portentous','Veritable','Indecisive','Opulent','Iridescent','Magnanimous','Altruistic','Ornery','Benevolent','Apprehensive','Suspicious','Indeterminate','Vacillating','Salubrious','Deleterious','Insidious','Audacious','Loquacious','Verdant','Omnipotent','Corybantic','Virile','Petulant','Alabaster','Courteous','Corpulent','Anachronistic','Effulgent','Pulchritudinous','Accidental','Incendiary','Bioluminescent','Quantum','Raunchy','Amiable'];
const nouns = ['Book Club','Wine Club','Familiars','Besties','Friends','Pals','Buddies','Gaggle','Associates','Companions','Colleagues','Mates','Amigos','Roommates','Compatriots','Cronies','Consorts','Trusted Advisors','Throng','Crowd','Circle','Congregation','Crew','Horde','Party','Rabble','Legion','Company','Bunch','Mob','Troupe','Bat Demons'];

var _ = require('underscore');

var roomNameGenerator = function(){
	var room_name = _.sample( adjectives ) +' '+ _.sample( nouns );
	return room_name;
};

module.exports = roomNameGenerator;