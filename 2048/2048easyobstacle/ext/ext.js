/*
	Extension JS for 2048ium.
*/

//Let the grid generate "0" randomly
GameManager.prototype.addRandomTile = function () {
	if (this.grid.cellsAvailable()) {
	  var value = Math.random() < 0.9 ? 2 : 0;
	  var tile = new Tile(this.grid.randomAvailableCell(), value);
  
	  this.grid.insertTile(tile);
	}
};

GameManager.prototype.move = function (direction) {
	// 0: up, 1: right, 2: down, 3: left
	var self = this;
  
	if (this.isGameTerminated()) return; // Don't do anything if the game's over
  
	var cell, tile;
  
	var vector     = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
  var moved      = false;
  var eliminated = [];
  
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
		  if (next && next.value === tile.value && !next.mergedFrom) {
        if(tile.value){
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === IumConfig.win) self.won = true;
        }else{
          // Add rule 0+0->none
          tile.eliminated = true;
          next.eliminated = true;
          eliminated.push(tile);
          eliminated.push(next);
          self.grid.removeTile(tile);
          self.grid.removeTile(next);
          tile.updatePosition(positions.next);
        }
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
    
    this.eliminated = eliminated;

	  this.actuate();
	}
};

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    // Animate the eliminated cells
    var eliminated = self.gameManager.eliminated;
    if(eliminated)
      eliminated.forEach(function (cell) {
        self.addTile(cell);
      });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};