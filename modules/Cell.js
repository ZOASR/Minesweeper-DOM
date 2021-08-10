import {
	Image,
	createCell,
	removeChildren,
} from './DOM.js';



export class Cell {
	constructor(i, j, board) {
		this.i = i;
		this.j = j;
		this.x = this.i * (board.scl);
		this.y = this.j * (board.scl);
		this.revealed = false;
		this.marked = false;
		this.total = 0;
		this.markedMines = 0;
		this.mine = false;
		this.board = board;
		this.cell = createCell(`width: ${this.board.scl}px; height: ${this.board.scl}px;`, this.board.board_elt);
		this.cell.onclick = () => {
			this.board.bombsBoard.innerHTML = this.board.bombs;
			this.board.check(this);
			this.show();
		};
	}

	show() {
		this.checkNeighbor();
		this.checkMarked();
		if (this.revealed) {
			removeChildren(this.cell);
			this.cell.style.cssText += "border-width: 1px;";
		} else {
			Image("assets/square.png", this.cell);
		}
		if (this.marked) {
			const gs = this.board.gameState;
			const gss = this.board.gameStates;
			(gs == gss.GAME_OVER) ? Image("assets/flag_error.png", this.cell): Image("assets/flag.png", this.cell);
		}
		if (this.mine && this.revealed) {
			Image("assets/bomb.jpg", this.cell);
		} else if (this.revealed) {
			this.cell.style.cssText += `font-size: ${this.board.scl - 5}px;`;
			if (this.revealed && !this.marked) {
				switch (this.total) {
					case 1:
						this.cell.innerText = "1";
						this.cell.style.color = "#0400FB";
						break;
					case 2:
						this.cell.innerText = "2";
						this.cell.style.color = "green";
						break;
					case 3:
						this.cell.innerText = "3";
						this.cell.style.color = "red";
						break;
					case 4:
						this.cell.innerText = "4";
						this.cell.style.color = "#010180";
						break;
					case 5:
						this.cell.innerText = "5";
						this.cell.style.color = "#830003";
						break;
					case 6:
						this.cell.innerText = "6";
						this.cell.style.color = "#008180";
						break;
					case 7:
						this.cell.innerText = "7";
						this.cell.style.color = "black";
						break;
					case 8:
						this.cell.innerText = "8";
						this.cell.style.color = "#827F80";
						break;
				}
			}
		}
	}

	Mark() {
		if (!this.revealed && this.board.bombs - this.board.markedBombs >= 0) {
			this.marked = true;
			this.board.markedBombs++;
			if (this.mine) {
				this.board.actualBombs++;
			}
		}
		this.show();
	}

	UnMark() {
		if (!this.revealed && this.board.bombs - this.board.markedBombs >= 0) {
			this.marked = false;
			this.board.markedBombs--;
			if (this.mine) {
				this.board.actualBombs--;
			}
		}
		this.show();
	}

	checkNeighbor() {
		let total = 0;
		if (this.mine) {
			this.total = -1;
			return;
		}
		for (let xoff = -1; xoff <= 1; xoff++) {
			for (let yoff = -1; yoff <= 1; yoff++) {
				const i_ = this.i + xoff;
				const j_ = this.j + yoff;
				if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
					const neighbor = this.board.grid[i_][j_];
					if (neighbor.mine) {
						total++;
					}
				}
			}
		}
		this.total = total;
		return total;
	}

	reveal() {
		this.revealed = true;
		this.floodFill();
		if (this.mine) {
			this.board.gameOver();
		}
	}

	floodFill() {
		for (let xoff = -1; xoff <= 1; xoff++) {
			for (let yoff = -1; yoff <= 1; yoff++) {
				const i_ = this.i + xoff;
				const j_ = this.j + yoff;
				if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
					const neighbor = this.board.grid[i_][j_];
					if (!neighbor.mine && !neighbor.revealed && this.total == 0) {
						neighbor.reveal();
						neighbor.UnMark();
					} else if (!neighbor.revealed && !neighbor.marked && this.markedMines == this.total) {
						neighbor.reveal();
						neighbor.UnMark();
					}
				}
			}
		}
	}

	checkMarked() {
		let Mtotal = 0;
		for (let xoff = -1; xoff <= 1; xoff++) {
			for (let yoff = -1; yoff <= 1; yoff++) {
				const i_ = this.i + xoff;
				const j_ = this.j + yoff;
				if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
					const neighbor = this.board.grid[i_][j_];
					if (neighbor.marked) {
						Mtotal++;
					}
				}
			}
		}
		this.markedMines = Mtotal;
	}
}