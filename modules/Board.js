import {
	Cell
} from './Cell.js';
import {
	make2DArray,
	createButton,
	createFlagButton,
	createResetButton,
	hideElement,
	showElement,
	removeChildren,
	Image
} from './DOM.js';

export class Board {
	constructor(cols, rows, scl) {
		this.gameStates = {
			START: "start",
			PLAYING: "playing",
			GAME_OVER: "game_over",
			GAME_WON: "game_won",
		};
		this.gameState = undefined;
		this.cols = cols;
		this.rows = rows;
		this.grid = make2DArray(cols, rows);
		this.scl = scl;
		this.width = this.cols * this.scl;
		this.height = this.rows * this.scl;
		this.bombs = 0;
		this.markedBombs = 0;
		this.actualBombs = 0;
		this.revealedBombs = 0;
		this.bombMode = true;
		this.firstPlay = true;
		this.bombsBoard = document.querySelector(".bombs");
		this.board_elt = undefined;
		this.button = undefined;
		this.easy = createButton("Easy: 50 Mines");
		this.easy.onclick = () => {
			this.bombs = 50;
			this.populateBoard();
		};
		this.medium = createButton('Medium: 150 Mines');
		this.medium.onclick = () => {
			this.bombs = 150;
			this.populateBoard();
		};
		this.hard = createButton('Hard: 250 Mines');
		this.hard.onclick = () => {
			this.bombs = 250;
			this.populateBoard();
		};
		this.resetButton = createResetButton('Reset Game!');
		this.resetButton.onclick = () => this.resetBoard();

		hideElement(document.querySelector(".container"));

		this.n = 0;
		this.counter = 0;
	}

	setGameState(state) {
		this.gameState = state;
	}

	populateBoard() {
		this.setGameState(this.gameStates.START);
		//Board
		this.board_elt = document.createElement("div");
		this.board_elt.classList.add("board");
		this.board_elt.style.gridTemplateRows = `repeat(${this.rows}, ${this.scl}px)`;
		this.board_elt.style.gridTemplateColumns = `repeat(${this.cols}, ${this.scl}px)`;
		document.querySelector(".container").appendChild(this.board_elt);
		document.querySelector(".container").style.display = "grid";

		//Bombs left
		this.bombsBoard.style.display = "block";
		this.bombsBoard.innerText = `${this.bombs}`;


		//Gamemode
		this.button = createFlagButton("", document.querySelector(".panel .mode_change"));
		this.button.src = "assets/bomb.jpg";
		hideElement(this.button);
		this.button.onclick = () => {
			this.bombMode = !this.bombMode;
			if (this.bombMode) {
				this.button.src = "assets/bomb.jpg";
			} else {
				this.button.src = "assets/flag.png";
			}
		};


		hideElement(document.getElementById("menu"));
		showElement(this.button);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j] = new Cell(i, j, this);
			}
		}
		while (this.n < this.bombs) {
			let x = Math.floor(Math.random() * this.cols);
			let y = Math.floor(Math.random() * this.rows);
			if (!this.grid[x][y].mine) {
				this.grid[x][y].mine = true;
				this.n++;
			}
		}

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].show();
			}
		}
	}

	resetBoard() {
		this.setGameState(this.gameStates.START);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].revealed = false;
				this.grid[i][j].mine = false;
				this.grid[i][j].UnMark();
				this.grid[i][j].total = 0;
			}
		}
		this.bombs = 0;
		this.markedBombs = 0;
		this.actualBombs = 0;
		this.revealedBombs = 0;
		this.n = 0;
		this.bombMode = true;
		this.firstPlay = true;
		this.hidden = true;
		hideElement(document.querySelector(".container"));
		document.querySelector(".panel .mode_change").removeChild(this.button);
		this.board_elt.remove();
		showElement(document.getElementById("menu"));
		document.getElementById("menu").style.display = "inline-table";
	}


	gameOver() {
		this.setGameState(this.gameStates.GAME_OVER);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].revealed = true;
				this.grid[i][j].show();
			}
		}
		console.warn('Game Over');
		showElement(this.resetButton);
	}


	WIN() {
		this.setGameState(this.gameStates.GAME_WON);
		showElement(this.resetButton);
	}

	check(cell) {
		this.setGameState(this.gameStates.PLAYING);
		if (cell.mine && cell.revealed) {
			this.gameOver();
		}
		if (this.bombs >= 50) {
			if (!this.bombMode) {
				if (!cell.marked) {
					cell.Mark();
				} else {
					cell.UnMark();
				}
				if (cell.revealed) {
					cell.floodFill();
				}
			} else if (this.bombMode) {
				if (!cell.marked) {
					if (this.firstPlay && cell.mine) {
						let b = true;
						cell.mine = false;
						cell.revealed = true;
						while (b) {
							let y = Math.floor(Math.random() * this.rows);
							let x = Math.floor(Math.random() * this.cols);
							if (!this.grid[x][y].mine) {
								this.grid[x][y].mine = true;
								for (let xoff = -1; xoff <= 1; xoff++) {
									for (let yoff = -1; yoff <= 1; yoff++) {
										const i_ = cell.i + xoff;
										const j_ = cell.j + yoff;
										const _i_ = x + xoff;
										const _j_ = y + yoff;
										if (i_ > -1 && i_ < this.cols && j_ > -1 && j_ < this.rows && _i_ > -1 && _i_ < this.cols && _j_ > -1 && _j_ < this.rows) {
											this.grid[i_][j_].show();
											this.grid[_i_][_j_].show();
										}
									}
								}
								b = false;
							}
						}
						this.firstPlay = false;
					} else if (!cell.mine) {
						cell.reveal();
						this.firstPlay = false;
					} else if (!this.firstPlay && cell.mine) {
						cell.reveal();
					}

				}
			}
		}
		if ((this.actualBombs >= this.bombs || this.actualBombs >= this.n) && this.bombs > 0 && this.actualBombs > 0)
			this.WIN();
		const bombsLeft = this.bombs - this.markedBombs;
		(bombsLeft >= 0) ? this.bombsBoard.innerText = `${bombsLeft}`: this.bombsBoard.innerText = "0";

	}
}