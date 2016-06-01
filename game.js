var Options = {
	COLS: 26,ROWS:26,
	KEY: {UP:38, DOWN:40, LEFT:37, RIGHT:39},
	DIR: {UP:0, RIGHT:1, DOWN:2, LEFT:3}
};
var EMPTY = 0, SNAKE = 1, FRUIT = 2;
		
function PlayGrid(){
	this.width = null,
	this.height = null,
	this.grid = null;

	this.init = (width, height, initialValue) => {
		this.width = width;
		this.height = height;
		this.grid = [];
		for(var x = 0; x < width; x++){
			this.grid.push([]);
			for(var y = 0; y < height; y++){
				this.grid[x].push(initialValue);
			}
		}
	}

	this.set = (x, y, value) => {
		this.grid[x][y] = value;
	}

	this.get = (x,y) => {
		return this.grid[x][y];
	}
}

var t = new PlayGrid();
t.init(10,10,0);
t.set(2,2,1);
console.log(t.get(2,2));