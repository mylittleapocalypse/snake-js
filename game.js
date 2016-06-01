var Options = {
	COLS: 26,ROWS:26,
	KEY: {UP:38, DOWN:40, LEFT:37, RIGHT:39},
	DIR: {UP:0, RIGHT:1, DOWN:2, LEFT:3}
};
var EMPTY = 0, SNAKE = 1, FRUIT = 2;
		
function PlayGrid() {
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

function Snake() {
	this.direction = null,
	this.last = null,
	this.queue = null;

	this.init = (x, y, initialDirection) => {
		this.direction = initialDirection;
		this.queue = [];
		this.insert(x,y);

		switch(this.direction) {
			case Options.Dir.UP:    this.insert(x  , y+1); 
				break;
			case Options.Dir.RIGHT: this.insert(x-1, y); 
				break;
			case Options.Dir.DOWN:  this.insert(x  , y-1); 
				break;
			case Options.Dir.LEFT:  this.insert(x+1, y); 
				break;
		}
	}

	this.insert = (x, y) => {
		this.queue.unshift({x:x, y:y});
		this.last = this.queue[0];
	}

	this.remove = () => {
		return this.queue.pop();
	}
}

var t = new PlayGrid();
t.init(10,10,0);
t.set(2,2,1);
console.log(t.get(2,2));