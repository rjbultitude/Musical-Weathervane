'use strict';

var locationsData = require('./get-locations')();
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {
	var myP5 = new P5(function(sketch) {
		var organC2 = null;
		var numNotes = 0;
		var organNotes = [];

		sketch.preload = function() {
			for (var item in locationsData) {
				numNotes++;
			}
			for (var i = numNotes - 1; i >= 0; i--) {
				var thisSound = sketch.loadSound('/audio/organ-C2.mp3');
				organNotes.push(thisSound);
				
			}
		};

		sketch.setup = function setup() {
			var myCanvas = sketch.createCanvas(800,600);
			myCanvas.parent('canvas-container');
			sketch.background(0,0,0);
			
			var num = 0;
			for (var i in locationsData) {
				organNotes[num].loop();

				//bearing
				var thisBearing = locationsData[num].bearing;
				var volume = sketch.map(thisBearing, 0, 100, 0, 1);
  				var nVolume = sketch.constrain(volume, 0.5, 1);
  				
  				//speed
  				var thisSpeed = locationsData[num].bearing;
				var speed = sketch.map(thisSpeed, 0.1, 100, 0, 2);
				var nSpeed = sketch.constrain(speed, 0.01, 4);
  				organNotes[i].amp(volume);
				organNotes[i].rate(speed);
				num++;
			}
			
		};

		sketch.draw = function draw() {
			sketch.background(0, 0, 0);
			sketch.noStroke();
			sketch.fill(255);
			sketch.rect(sketch.mouseX, sketch.mouseY, 10, 10);

			// for (var i = numNotes - 1; i >= 0; i--) {
				
			// };
			
			/// Set the volume to a range between 0 and 1.0

			// Set the rate to a range between 0.1 and 4
			// Changing the rate alters the pitch
		};

	}, 'canvas-container');

	return myP5;
};
