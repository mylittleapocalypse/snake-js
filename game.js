var Options = {
	COLS: 26,ROWS:26,
	KEY: {UP:38, DOWN:40, LEFT:37, RIGHT:39},
	DIR: {UP:0, RIGHT:1, DOWN:2, LEFT:3},
	WIDTH: 20, HEIGHT:20,
	CELLSIZE: 20, LOOP: false
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

	this.get = (x, y) => {
		return this.grid[x][y];
	}

	this.placeFood = () => {
		var empty = [];
		for(var x = 0; x < this.width; x++) {
			for(var y = 0; y < this.height; y++){
				if(this.grid[x][y] === EMPTY){
					empty.push({x:x, y:y});
				}
			}
		}
		var randomPosition = empty[Math.floor(Math.random()*empty.length)];
		this.grid[randomPosition.x][randomPosition.y] = FRUIT;
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
			case Options.DIR.UP:    this.insert(x  , y+1); 
				break;
			case Options.DIR.RIGHT: this.insert(x-1, y  ); 
				break;
			case Options.DIR.DOWN:  this.insert(x  , y-1); 
				break;
			case Options.DIR.LEFT:  this.insert(x+1, y  ); 
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

function Game(){
	var canvas, context, keystate, frames, score;
	this.playgrid = new PlayGrid();
	this.snake = new Snake();
	this.init = () => {
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		canvas.width = Options.COLS * Options.CELLSIZE;
		canvas.height = Options.ROWS * Options.CELLSIZE;
		document.body.appendChild(canvas);

		frames = 0;
		keystate = {};

		document.addEventListener("keydown", e => keystate[e.keyCode] = true);
		document.addEventListener("keyup", e => delete keystate[e.keyCode]);
		this.reset();
	}

	this.reset = () => {
		this.playgrid.init(Options.COLS, Options.ROWS, EMPTY);
		var startPosition = {x:Math.floor(Options.COLS/2), y:Options.ROWS-3};
		this.snake.init(startPosition.x, startPosition.y, Options.DIR.UP);
		this.playgrid.placeFood();
		score = 0;
		this.update();
	}

	this.update = () => {
		frames++;
		if(keystate[Options.KEY.UP]    && this.snake.direction !== Options.DIR.DOWN)  this.snake.direction = Options.DIR.UP;
		if(keystate[Options.KEY.RIGHT] && this.snake.direction !== Options.DIR.LEFT)  this.snake.direction = Options.DIR.RIGHT;
		if(keystate[Options.KEY.DOWN]  && this.snake.direction !== Options.DIR.UP)    this.snake.direction = Options.DIR.DOWN;
		if(keystate[Options.KEY.LEFT]  && this.snake.direction !== Options.DIR.RIGHT) this.snake.direction = Options.DIR.LEFT;

		if(frames % 4 === 0) {
			var nx = this.snake.last.x;
			var ny = this.snake.last.y;

			switch(this.snake.direction) {
				case Options.DIR.UP:    ny--; 
					break;
				case Options.DIR.RIGHT: nx++; 
					break;
				case Options.DIR.DOWN:  ny++; 
					break;
				case Options.DIR.LEFT:  nx--; 
					break;
			}

			if(Options.LOOP) {
				if(nx===this.playgrid.width)
					nx = 0;
				if(nx < 0)
					nx = this.playgrid.width - 1;
				if(ny===this.playgrid.height)
					ny = 0;
				if(ny < 0)
					ny = this.playgrid.height -1;
			}
			else{
				if(0 > nx || nx > this.playgrid.width-1  ||
			   	   0 > ny || ny > this.playgrid.height-1) {
					return this.reset();
				}
			}
			if(this.playgrid.get(nx, ny)===SNAKE)
				return this.reset();

			if(this.playgrid.get(nx,ny) === FRUIT) {
				var tail = {x:nx, y:ny};
				this.playgrid.placeFood();
				score++;
			}
			else{
				var tail = this.snake.remove();
				this.playgrid.set(tail.x, tail.y, EMPTY);
			}
			this.playgrid.set(nx, ny, SNAKE);
			this.snake.insert(nx,ny);
		}
		this.draw();
		window.requestAnimationFrame(this.update);
	}

	this.draw = () => {
		var tileWidth = canvas.width / this.playgrid.width;
		var tileHeight = canvas.height / this.playgrid.height;

		for(var x = 0; x < this.playgrid.width; x++){
			for(var y = 0; y < this.playgrid.height; y++){
				switch(this.playgrid.get(x,y)){
					case EMPTY: context.fillStyle = "#FFF";
						break;
					case SNAKE: context.fillStyle = "#AFA";
						break;
					case FRUIT: context.fillStyle = "#CCC";
						break;
				}
				context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
			}
		}
		context.fillStyle = "#222";
		context.font = "30px sans-serif";
		context.fillText(score, 20, 40);
	}	
}

var game = new Game();
game.init();