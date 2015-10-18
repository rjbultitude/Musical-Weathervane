'use strict';

var p5 = require('../libs/p5.js');
//p5.sound = require('/src/scripts/libs/p5.sound');
//var locationsData = require('./get-locations.js');

module.exports = function() {
	var myP5 = new p5(function(sketch) {

		var x = 1;
		var y = 1;

		console.log('sketch', sketch);

		function setup() {
			var myCanvas = sketch.createCanvas(800,600);
			myCanvas.parent('canvas-container');
			sketch.background(0,0,0);
		}

		function draw() {
			sketch.background(0, 0, 0);
			sketch.noStroke();
			sketch.fill(255);
			sketch.rect(x, y, 10, 10);
			x++;
			y++;
		}
	}, 'canvas-container');

	return myP5;
};
