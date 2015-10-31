var move = function( array, origin, destination ){
	var moving_item = array.splice( origin, 1 )[0];
	array.splice( destination, 0, moving_item );
};

module.exports = move;
