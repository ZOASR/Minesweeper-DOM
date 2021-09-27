export function make2DArray(col, row) {
	let arr = new Array(col);
	for (let i = 0; i < col; i++) {
		arr[i] = new Array(row);
	}
	return arr;
}

export function createCell(stl, board) {
	let cell = document.createElement("button");
	cell.classList.add("cell");
	cell.style.cssText = stl;
	board.appendChild(cell);
	return cell;
}

export function hideElement(elt) {
	elt.style.display = "none";
}

export function showElement(elt) {
	elt.style.display = "";
}

export function createButton(Label, parent = "#menu") {
	const btn = document.createElement("button");
	btn.innerHTML = Label;
	document.body.querySelector(parent).appendChild(btn);
	btn.classList.add("_button");
	return btn;
}

export function createFlagButton(Label, parent) {
	const btn = document.createElement("img");
	btn.innerHTML = Label;
	parent.appendChild(btn);
	btn.classList.add("flag_bomb");
	return btn;
}

export function createResetButton(Label) {
	const btn = document.createElement("button");
	btn.innerHTML = Label;
	document.querySelector(".container .reset_div").appendChild(btn);
	btn.classList.add("reset_button");
	return btn;
}

export function drawImage(src, parent, css) {
	let img = document.createElement("img");
	img.style.cssText = "width: inherit; height: inherit;" + css;
	img.src = src;
	removeChildren(parent);
	parent.appendChild(img);
}
export function removeChildren(e) {
	e.innerHTML = "";
}
