/*
	Extension JS for 2048ium.
*/

FibonacciID = {
	1: 1,
	2: 2,
	3: 3,
	5: 4,
	8: 5,
	13: 6,
	21: 7,
	34: 8,
	55: 9,
	89: 10,
	144: 11,
	233: 12,
	377: 13,
	610: 14,
	987: 15,
	1597: 16,
	2584: 17
};

FibonacciMergeable = function (a, b) {
	var ida = FibonacciID[a];
	var idb = FibonacciID[b];
	return ida - idb === 1 || idb - ida === 1 || (a === 1 && b === 1);
}

// Add 1 and 2 in random
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 1 : 2;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Add fibonacci merging rule
GameManager.prototype.move = function (direction) {
	// 0: up, 1: right, 2: down, 3: left
	var self = this;
  
	if (this.isGameTerminated()) return; // Don't do anything if the game's over
  
	var cell, tile;
  
	var vector     = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved      = false;
  
	// Save the current tile positions and remove merger information
	this.prepareTiles();
  
	// Traverse the grid in the right direction and move tiles
	traversals.x.forEach(function (x) {
	  traversals.y.forEach(function (y) {
		cell = { x: x, y: y };
		tile = self.grid.cellContent(cell);
  
		if (tile) {
		  var positions = self.findFarthestPosition(cell, vector);
		  var next      = self.grid.cellContent(positions.next);
  
		  // Only one merger per row traversal?
		  if (next && FibonacciMergeable(next.value, tile.value) && !next.mergedFrom) {
			var merged = new Tile(positions.next, tile.value + next.value);
			merged.mergedFrom = [tile, next];
  
			self.grid.insertTile(merged);
			self.grid.removeTile(tile);
  
			// Converge the two tiles' positions
			tile.updatePosition(positions.next);
  
			// Update the score
			self.score += merged.value;
  
			// The mighty 144 tile
			if (merged.value === IumConfig.win) self.won = true;
		  } else {
			self.moveTile(tile, positions.farthest);
		  }
  
		  if (!self.positionsEqual(cell, tile)) {
			moved = true; // The tile moved from its original cell!
		  }
		}
	  });
	});
  
	if (moved) {
	  this.addRandomTile();
  
	  if (!this.movesAvailable()) {
		this.over = true; // Game over!
	  }
  
	  this.actuate();
	}
  };
GameManager.prototype.tileMatchesAvailable = function () {
	var self = this;

	var tile;

	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			tile = this.grid.cellContent({ x: x, y: y });

			if (tile) {
				for (var direction = 0; direction < 4; direction++) {
					var vector = self.getVector(direction);
					var cell   = { x: x + vector.x, y: y + vector.y };

					var other  = self.grid.cellContent(cell);

					if (other && FibonacciMergeable(other.value, tile.value)) {
						return true; // These two tiles can be merged
					}
				}
			}
		}
	}

	return false;
};