import {
	Board
} from './modules/Board.js';

const rows = 25;
const cols = 30;
const scl = window.innerHeight / rows * 0.8;


let board = new Board(cols, rows, scl);