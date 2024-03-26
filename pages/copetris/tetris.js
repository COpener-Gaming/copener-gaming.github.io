"use strict";
let tetris = {
	getObject: function (){}
};

(function(){
	let tetrisObj = {
		queue: {
			seed: 0,
			position: 0
		},
		hold: {
			enabled: true,
			piece: "E"
		},
		board: {
			current: {
				piece: "E",
				pos: {
					x: 0,
					y: 0
				},
				rotation: 0
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
			inputs: [],
			colours: {
				"E": "#000000",
				"T": "#FF00FF"
			}
		}
	};
	for (let y = 0; y< tetrisObj.board.field.trueHeight; y++) {
		let row = [];
		for (let x = 0; x < tetrisObj.board.field.width; x++) {
			row.push("E");
		}
		tetrisObj.board.field.data.push(row);
	}
	tetris.getObject = function () {
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
})();