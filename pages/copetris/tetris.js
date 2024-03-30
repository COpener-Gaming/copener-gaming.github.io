"use strict";
let tetris = {
	getObject: function(){},
	devGetObject: function(){},
	generate: function(){},
};

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function splitmix32(a) {
 return function() {
   a |= 0;
   a = a + 0x9e3779b9 | 0;
   let t = a ^ a >>> 16;
   t = Math.imul(t, 0x21f0aaad);
   t = t ^ t >>> 15;
   t = Math.imul(t, 0x735a2d97);
   return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}

class Piece {
	constructor(p) {
		switch (p) {
			case "I": 
				this.rotations = [
					[ // (x, y) offset from centre 
						(-1, +1),
						(0, +1),
						(+1, +1),
						(+2, +1)
					],
					[
						(+1, +2),
						(+1, +1),
						(+1, 0),
						(+1, -1)
					],
					[ // (x, y) offset from centre 
						(-1, 0),
						(0, 0),
						(+1, 0),
						(+2, 0)
					],
					[
						(0, +2),
						(0, +1),
						(0, 0),
						(0, -1)
					]
				];
		}
	}
}


(function(){
	let tetrisObj = {
		queue: {
			seed: "nakavora",
			position: 0,
			data: []
		},
		hold: {
			enabled: true,
			piece: "E"
		},
		board: {
			current: {
				piece: new Piece("E")
			},
			field: {
				width: 10,
				renderedHeight: 20,
				trueHeight: 40,
				data: []
			}
		},
		meta: {
			score: 0,
			time: 0,
			level: 0,
			attack: 0,
			lines: 0,
			inputs: [],
			colours: {
				"E": "#000000",
				"T": "#FF00FF",
				"I": "#00FFFF",
				"O": "#FFFF00",
				"S": "#00FF00",
				"Z": "#FF0000",
				"L": "#FFAA00",
				"J": "#0000FF"
			}
		}
	};

	tetrisObj.queue.seed = (Date.now() * Math.random()).toString();

	// URL queries 
	const urlSplit = window.location.href.split("?");
	if (urlSplit.length > 1) {
		// JS magic 
		let searchParams = new URLSearchParams(urlSplit[urlSplit.length - 1]); 
		if (searchParams.has("seed")) tetrisObj.queue.seed = searchParams.get("seed");
	}

	const seed = cyrb128(tetrisObj.queue.seed);
	let rand = splitmix32(seed[0], seed[1], seed[2], seed[3]);
	
	for (let y = 0; y< tetrisObj.board.field.trueHeight; y++) {
		let row = [];
		for (let x = 0; x < tetrisObj.board.field.width; x++) {
			row.push("E");
		}
		tetrisObj.board.field.data.push(row);
	}

	tetris.getObject = function() {
		if (typeof structuredClone === "function") { 
			return structuredClone(tetrisObj);
		} else { 
			function clone(obj) { // I stole this from StackOverflow lmao
				var copy;

				// Handle the 3 simple types, and null or undefined
				if (null == obj || "object" != typeof obj) return obj;

				// Handle Date
				if (obj instanceof Date) {
					copy = new Date();
					copy.setTime(obj.getTime());
					return copy;
				}

				// Handle Array
				if (obj instanceof Array) {
					copy = [];
					for (var i = 0, len = obj.length; i < len; i++) {
						copy[i] = clone(obj[i]);
					}
					return copy;
				}

				// Handle Object
				if (obj instanceof Object) {
					copy = {};
					for (var attr in obj) {
						if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
					}
					return copy;
				}

				throw new Error("Unable to copy obj! Its type isn't supported or your browser is too old.");
			}
			return clone(tetrisObj);
		}
	};
	tetris.devGetObject = function() {return tetrisObj;	};
	tetris.generate = function() {
		let bag = ["J", "L", "S", "Z", "I", "O", "T"];
		for (; bag.length > 0; ) tetrisObj.queue.data.push(bag.splice(Math.floor(rand() * bag.length), 1)[0]);
	}
})();