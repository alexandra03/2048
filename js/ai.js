function AI() {

}


// Calculate the number of open tiles
AI.prototype.open_tiles = function (game) {
	var grid = game.grid;
	return grid.availableCells().length-1;	
};