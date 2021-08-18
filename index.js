import {
	Board
} from './modules/Board.js';

const rows = 30;
const cols = 40;
const scl = window.innerHeight / rows * 0.8;


let board = new Board(cols, rows, scl);