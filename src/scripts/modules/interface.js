'use strict';

var locationsData = require('./get-locations')();
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {
	var myP5 = new P5(function(sketch) {
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
				//In degrees
				var thisBearing = locationsData[num].bearing;
				var pitch = sketch.map(thisBearing, 0, 360, 0.1, 2.0);
  				//pitch = sketch.constrain(pitch, 0.5, 1);
  				console.log('pitch', pitch);
  				
  				//speed
  				//Typically between 0 & 32 m/s
  				var thisSpeed = Math.round(locationsData[num].speed);
				var volume = sketch.map(thisSpeed, 0, 32, 0.4, 1.0);
				//volume = sketch.constrain(speed, 0.01, 4);
				console.log('volume', volume);
  				organNotes[i].amp(volume);
				organNotes[i].rate(pitch);
				num++;
			}
			
		};

		sketch.draw = function draw() {
			sketch.background(0, 0, 0);
			sketch.noStroke();
			sketch.fill(255);
		};

	}, 'canvas-container');

	return myP5;
};
