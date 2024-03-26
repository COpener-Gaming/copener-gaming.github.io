$(document).ready(function(){
	let tetrisObject = tetris.getObject();
	let userData = {
		frames: 60,
		controls: {
			cw: "KeyV",
			ccw: "KeyX",
			"180": "KeyC",
			l: "ArrowLeft",
			r: "ArrowRight",
			hd: "ArrowUp",
			sd: "ArrowDown"
		},
		handling: {
			arr: 0,
			das: 133,
			sdf: Infinity,
			dasCancel: true
		}
	};
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
			function update() {
				const ctx = canvas.getContext("2d");
				context.clearRect(0, 0, canvas.width, canvas.height);
				for (let y = 0; y< tetrisObject.board.field.trueHeight; y++) {
					for (let x = 0; x < tetrisObject.board.field.width; x++) {
						ctx.fillStyle = tetrisObject.meta.colours[tetrisObject.board.field.data[tetrisObject.board.field.trueHeight - tetrisObject.board.field.renderedHeight + y][x]];
						ctx.fillRect(x * board.clientWidth / tetrisObject.board.field.width + 1, y * board.clientWidth / tetrisObject.board.field.width + 1, board.clientWidth / tetrisObject.board.field.width - 2, board.clientWidth / tetrisObject.board.field.width - 2)
					}
				}
			}
			let render = setInterval(update, 1000/userData.frames);
		})();
		
	})();
});
