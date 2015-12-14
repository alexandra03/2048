function AI(game) {
	this.game = game;
	this.grid = game.grid;
}


// Calculate the number of open tiles
AI.prototype.openTiles = function () {
	return this.grid.availableCells().length-1;	
};

// Calculate the number of merges possible
AI.prototype.numMerges = function () {
  var matches = 0;
  var tile, cell, other;

  for (var x = 0; x < this.game.size; x++) {
    for (var y = 0; y < this.game.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (!tile) { continue; }
      
      for (var direction = 0; direction < 4; direction++) {
        var vector = this.game.getVector(direction);

        for (var i = 1; i < this.game.size; i++) {
          cell   = { x: x + i*vector.x, y: y + i*vector.y };
          other  = this.grid.cellContent(cell);
  		  
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