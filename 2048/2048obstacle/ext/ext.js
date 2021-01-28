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