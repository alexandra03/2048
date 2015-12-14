function AI(game) {
	this.game = game;
	this.grid = game.grid;
}


// Calculate the number of open tiles
AI.prototype.open_tiles = function () {
	return this.grid.availableCells().length-1;	
};

// Calculate the number of merges possible
AI.prototype.num_merges = function () {

}