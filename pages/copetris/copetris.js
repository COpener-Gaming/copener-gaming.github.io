$(document).ready(function(){
	let tetrisObject = tetris.getObject();
	(function(){
		// initialise ui 
		
		(function(){
			// board
			let board = document.createElement("div");
			board.classList.add("board");
			board.style.height = "calc(100vh - 100px)";
			board.style.width = "calc(" + tetrisObject.board.field.width * 100 / tetrisObject.board.field.renderedHeight + "vh - " + tetrisObject.board.field.width * 100 / tetrisObject.board.field.renderedHeight + "px)";
			board.style.position = "absolute";
			board.style.left = "calc(" + tetrisObject.board.field.width * 50 / tetrisObject.board.field.renderedHeight + "vh - " + (tetrisObject.board.field.width * 50 / tetrisObject.board.field.renderedHeight + 2) + "px)";
			board.style.top = "-2px";
			board.style.border = "2px solid white";
			board.style.backgroundColor = "999999";
			$(".container").append(board);
			let canvas = document.createElement("canvas");
			canvas.style.position = "absolute";
			canvas.style.width ="100%";
			canvas.style.height = "100%";
			board.append(canvas);
			canvas.width  = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			
			// grid 
			for (let y = 0; y< tetrisObject.board.field.trueHeight; y++) {
				for (let x = 0; x < tetrisObject.board.field.width; x++) {
					let gridSpace = document.createElement("div");
					const ctx = canvas.getContext("2d");
					ctx.fillStyle = tetrisObject.meta.colours[tetrisObject.board.field.data[tetrisObject.board.field.trueHeight - tetrisObject.board.field.renderedHeight + y][x]];
					ctx.fillRect(x * board.clientWidth / tetrisObject.board.field.width + 1, y * board.clientWidth / tetrisObject.board.field.width + 1, board.clientWidth / tetrisObject.board.field.width - 2, board.clientWidth / tetrisObject.board.field.width - 2)
				}
			}
		})();
		
	})();
});