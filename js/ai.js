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

// Heuristic based on the grouping of large tiles
AI.prototype.large_number_grouping = function () {
	var cells = this.grid.cells;
	// Find largest/second largest valued tiles
	var max_val = 0;
	var second_max_val = 0;
	for (var row = 0; row < cells.length; row++){
		for (var col = 0; col < cells[0].length; col++){
			if (cells[row][col] != null && cells[row][col].value > max_val){
				second_max_val = max_val;
				max_val = cells[row][col].value;
			}
			else if (cells[row][col] != null && cells[row][col].value > second_max_val && cells[row][col].value != max_val){
				second_max_val = cells[row][col].value;
			}
		}
	}

	// Make arrays of these largest values
	var max_vals = [];
	var second_max_vals = [];
	for (var row = 0; row < cells.length; row++){
		for (var col = 0; col < cells[0].length; col++){
			if (cells[row][col] != null && cells[row][col].value == max_val){
				max_vals.push(cells[row][col]);
			}
			else if (cells[row][col] != null && cells[row][col].value == second_max_val){
				second_max_vals.push(cells[row][col]);
			}
		}
	}
	
	//Find avg distances from largest valued tile to second largest valued tile
	var totalDistance = 0;
	for (var i = 0; i < max_vals.length; i++){
		for (var j = 0; j < second_max_vals.length; j++){
			totalDistance += (Math.abs(max_vals[i].x - second_max_vals[j].x) + Math.abs(max_vals[i].y - second_max_vals[j].y))
		}
	}

	return totalDistance/(max_vals.length * second_max_vals.length);
};