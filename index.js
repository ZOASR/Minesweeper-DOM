import {
	Board
} from './modules/Board.js';

const rows = 30;
const cols = 40;
const scl = window.innerHeight / rows * 0.8;


let board = new Board(cols, rows, scl);

window.onresize = () => {
	const scl = window.innerHeight / board.rows * 0.8;
	board.scl = scl;
	board.board_elt.style.gridTemplateRows = `repeat(${board.rows}, ${scl}px)`;
	board.board_elt.style.gridTemplateColumns = `repeat(${board.cols}, ${scl}px)`;
	for (let i = 0; i < board.cols; i++) {
		for (let j = 0; j < board.rows; j++) {
			board.grid[i][j].cell.style.width = `${scl}px`;
			board.grid[i][j].cell.style.height = `${scl}px`;
			board.grid[i][j].cell.style.cssText += `font-size: ${scl - 5}px;`;
		}
	}
};