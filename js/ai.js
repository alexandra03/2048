function AI(game) {
	this.game = game;
	this.grid = game.grid;

	this.OTWeight  = 2;
	this.NMWeight  = 1;
	this.LNGWeight = 1;
	this.CVWeight  = 0.1;

	this.maxSearchDepth = 4;

	this.checkThreshold = 6;
}

// Update the weights of the search heuristics
AI.prototype.updateWeights = function (OTWeight, NMWeight, LNGWeight, CVWeight){
	this.OTWeight  = OTWeight;
	this.NMWeight  = NMWeight;
	this.LNGWeight = LNGWeight;
	this.CVWeight  = CVWeight;
}

// Update the weights of the search heuristics
AI.prototype.logWeights = function (){
	console.log("OTWeight " + this.OTWeight);
	console.log("NMWeight "  + this.NMWeight);
	console.log("LNGWeight " + this.LNGWeight);
	console.log("CVWeight "  + this.CVWeight);
}

// Calculate the number of open tiles
AI.prototype.openTiles = function (grid) {
	return grid.availableCells().length-1;	
};

// Calculate the number of merges possible
AI.prototype.numMerges = function (game) {
  var matches = 0;
  var tile, cell, other;

  for (var x = 0; x < this.game.size; x++) {
    for (var y = 0; y < this.game.size; y++) {
      tile = game.grid.cellContent({ x: x, y: y });

      if (!tile) { continue; }
      
      for (var direction = 0; direction < 4; direction++) {
        var vector = game.getVector(direction);

        for (var i = 1; i < game.size; i++) {
          cell   = { x: x + i*vector.x, y: y + i*vector.y };
          other  = game.grid.cellContent(cell);
  		  
  		  if (other == null) { continue; }

          if (other.value == tile.value) {
          	matches++;
          }

          break;
        }
      }
    }
  }
  return matches;
};

// Heuristic based on the grouping of large tiles
AI.prototype.largeNumberGrouping = function (grid) {
	var cell;

	// Find largest/second largest valued tiles
	var max_val = 0;
	var second_max_val = 0;

	for (var x = 0; x < grid.size; x++){
		for (var y = 0; y < grid.size; y++){
			cell = grid.cellContent({x: x, y: y});
			if (cell && cell.value > max_val){
				second_max_val = max_val;
				max_val = cell.value;
			}
			else if (cell && cell.value > second_max_val && cell.value != max_val){
				second_max_val = cell.value;
			}
		}
	}

	// Make arrays of these largest values
	var max_vals = [];
	var second_max_vals = [];

	for (var x = 0; x < grid.size; x++){
		for (var y = 0; y < grid.size; y++){
			cell = grid.cellContent({x: x, y: y});
			if (cell && cell.value == max_val){
				max_vals.push(cell);
			}
			else if (cell && cell.value == second_max_val){
				second_max_vals.push(cell);
			}
		}
	}
	
	//Find avg distances from largest valued tile to second largest valued tile
	var totalDistance = 0;
	for (var i = 0; i < max_vals.length; i++){
		for (var j = 0; j < second_max_vals.length; j++){
			totalDistance += (Math.abs(max_vals[i].x - second_max_vals[j].x) 
							+ Math.abs(max_vals[i].y - second_max_vals[j].y));
		}
	}

	return 6 - totalDistance/(max_vals.length * second_max_vals.length);
};

AI.prototype.cornerBundle = function (game) {
	var total = 0;
	var cell;

	for (var x = 0; x < this.game.size; x++) {
		for (var y = 0; y < this.game.size; y++) {
			cell = game.grid.cellContent({x: x, y: y});
			if (cell) {
				total += (6-(x+y)) * Math.log2(cell.value);
			}
		}
	}

	return total;
};

AI.prototype.boardValue = function (game) {	
	var openTiles = this.openTiles(game.grid) * this.OTWeight;
	var numMerges = this.numMerges(game) * this.NMWeight;
	var lrgeNumGr = this.largeNumberGrouping(game.grid) * this.LNGWeight;
	var cornerVal = this.cornerBundle(game) * this.CVWeight;

	return openTiles + numMerges + lrgeNumGr;
};

AI.prototype.lookAhead = function () {
	var best_direction = 0;
	var best_board_value = 0;
	var board_value;
	var original_board_value = this.boardValue(this.game);

	for (var direction = 0; direction < 4; direction++) {
		this.game.move(direction, true);
		this.game.actuator.clearMessage();
		board_value = this.boardValue(this.game);

		if (board_value > best_board_value && original_board_value!=board_value){
			best_board_value = board_value;
			best_direction = direction;
		}
		this.game.undo();
	}

	return best_board_value;
};

AI.prototype.searchLookAheadHelper = function (depth){
	if (depth == this.maxSearchDepth || (this.game.grid.availableCells() > 8 && this.score < 2000 && depth == 2)){
		return [0, this.lookAhead()];
	}

	var best_direction = 0;
	var best_board_value = 0;
	var board_value = 0;
	var original_board_value = this.boardValue(this.game);

	for (var direction = 0; direction < 4; direction++) {
		this.game.move(direction, true);
		this.game.actuator.clearMessage();
		board_value = this.searchLookAheadHelper(depth + 1)[1];
		if (depth == 0){
			board_value += this.cornerBundle(this.game) * this.CVWeight;
		}
		this.game.undo();

		if (board_value > best_board_value && original_board_value!=board_value){
			best_board_value = board_value;
			best_direction = direction;
		}
	}

	return [best_direction, best_board_value];
};

AI.prototype.searchLookAhead = function (){
	return this.searchLookAheadHelper(0)[0];
};














