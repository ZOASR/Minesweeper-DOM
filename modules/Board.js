import { Cell } from "./Cell.js";
import {
	make2DArray,
	createButton,
	createFlagButton,
	createResetButton,
	hideElement,
	showElement,
} from "./DOM.js";

export class Board {
	constructor(cols, rows, scl) {
		this.gameStates = {
			START: "start",
			PLAYING: "playing",
			CHECKING: "checking",
			GAME_OVER: "game_over",
			GAME_WON: "game_won",
		};
		this.stateImages = {
			start: "./assets/happy.png",
			playing: "./assets/happy.png",
			checking: "./assets/amazed.png",
			game_over: "./assets/dead.png",
			game_won: "./assets/cool.png",
		};
		this.gameState = undefined;
		this.state_elt = document.querySelector(".state");
		hideElement(this.state_elt);
		this.stateImg_elt = document.querySelector(".state > img");
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
		this.bombsBoard = document.querySelector("#b_container");
		this.board_elt = undefined;
		this.changeModeButton = undefined;
		this.easy = createButton("Easy: 50 Mines");
		this.easy.onclick = () => {
			this.bombs = 50;
			this.populateBoard();
		};
		this.medium = createButton("Medium: 150 Mines");
		this.medium.onclick = () => {
			this.bombs = 150;
			this.populateBoard();
		};
		this.hard = createButton("Hard: 250 Mines");
		this.hard.onclick = () => {
			this.bombs = 250;
			this.populateBoard();
		};
		this.resetButton = createResetButton("Reset Game!");
		this.resetButton.onclick = () => this.resetBoard();

		hideElement(document.querySelector(".container"));

		this.n = 0;
		this.counter = 0;
	}

	setGameState(state) {
		this.gameState = state;
		if (this.bombMode || state != this.gameStates.CHECKING)
			this.stateImg_elt.src = this.stateImages[state];
	}

	populateBoard() {
		this.setGameState(this.gameStates.START);
		//Board
		this.board_elt = document.createElement("div");
		this.board_elt.classList.add("board");
		this.board_elt.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
		const boardContainer = document.querySelector(".container");
		boardContainer.appendChild(this.board_elt);
		boardContainer.style.display = "grid";

		//Bombs left
		this.dynamicColoring();
		this.bombsBoard.style.display = "block";
		this.bombsBoard.innerText = `${this.bombs}`;

		//Gamemode
		this.changeModeButton = createFlagButton(
			"",
			document.querySelector(".container .mode_change")
		);
		this.changeModeButton.src = "assets/bomb.jpg";
		hideElement(this.changeModeButton);
		this.changeModeButton.onclick = () => {
			this.bombMode = !this.bombMode;
			if (this.bombMode) {
				this.changeModeButton.src = "assets/bomb.jpg";
			} else {
				this.changeModeButton.src = "assets/flag.png";
			}
		};

		hideElement(document.getElementById("menu"));
		showElement(this.state_elt);
		showElement(this.changeModeButton);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j] = new Cell(i, j, this);
			}
		}
		while (this.n < this.bombs) {
			const x = Math.floor(Math.random() * this.cols);
			const y = Math.floor(Math.random() * this.rows);
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

		hideElement(this.state_elt);
		hideElement(document.querySelector(".container"));
		showElement(document.getElementById("menu"));
		document.getElementById("menu").style.display = "inline-table";
		document
			.querySelector(".container .mode_change")
			.removeChild(this.changeModeButton);
		this.board_elt.remove();
	}

	gameOver() {
		this.setGameState(this.gameStates.GAME_OVER);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].revealed = true;
				this.grid[i][j].show();
			}
		}
		console.warn("Game Over");
		showElement(this.resetButton);
	}

	WIN() {
		this.setGameState(this.gameStates.GAME_WON);
	}

	dynamicColoring() {
		const bombsLeft = this.bombs - this.markedBombs;
		const hue = this.mapHue(bombsLeft, 0, this.bombs, 100, 0);
		// this.bombsBoard.style.color = `hsl(${hue}, 100%, 50%) `;
		// this.bombsBoard.style.backgroundColor = `hsl(${hue}, 100%, 30%) `;
		this.bombsBoard.style.cssText += ` text-shadow: 0 3px 5px hsl(${hue}, 100%, 25%);
												box-shadow: inset 0 0 20px hsl(${hue}, 100%, 50%);
												background-color: hsl(${hue}, 100%, 35%);
												color: hsl(${hue}, 100%, 50%); `;
	}

	mapHue(x, in_min, in_max, out_min, out_max) {
		return (
			((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
		);
	}

	check(cell) {
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
							const y = Math.floor(Math.random() * this.rows);
							const x = Math.floor(Math.random() * this.cols);
							if (!this.grid[x][y].mine) {
								this.grid[x][y].mine = true;
								for (let xoff = -1; xoff <= 1; xoff++) {
									for (let yoff = -1; yoff <= 1; yoff++) {
										const i_ = cell.i + xoff;
										const j_ = cell.j + yoff;
										const _i_ = x + xoff;
										const _j_ = y + yoff;
										if (
											i_ > -1 &&
											i_ < this.cols &&
											j_ > -1 &&
											j_ < this.rows &&
											_i_ > -1 &&
											_i_ < this.cols &&
											_j_ > -1 &&
											_j_ < this.rows
										) {
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
		if (
			(this.actualBombs >= this.bombs || this.actualBombs >= this.n) &&
			this.bombs > 0 &&
			this.actualBombs > 0
		) {
			this.WIN();
		}

		const bombsLeft = this.bombs - this.markedBombs;
		this.bombsBoard.innerText = bombsLeft >= 0 ? `${bombsLeft}` : "0";
		this.dynamicColoring();
	}
}
