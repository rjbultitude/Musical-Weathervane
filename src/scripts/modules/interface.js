'use strict';

var locationsData = require('./get-locations');
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {
	var myP5 = new P5(function(sketch) {

		var x = 1;
		var y = 1;
		var soundTest = null;

		sketch.preload = function() {
			soundTest = sketch.loadSound('/audio/2note.mp3');
		};

		sketch.setup = function setup() {
			var myCanvas = sketch.createCanvas(800,600);
			myCanvas.parent('canvas-container');
			sketch.background(0,0,0);

			soundTest.setVolume(0.1);
  			soundTest.play();
		};

		sketch.draw = function draw() {
			sketch.background(0, 0, 0);
			sketch.noStroke();
			sketch.fill(255);
			sketch.rect(x, y, 10, 10);
			x++;
			y++;
		};

	}, 'canvas-container');

	return myP5;
};
