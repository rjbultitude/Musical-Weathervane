'use strict';

var	getLocations = require('./get-locations');
var locationsData = null;
var loadJSONFn = require('./load-json');
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {

	var loadNewDataBtn = document.getElementById('load');
	loadNewDataBtn.addEventListener('click', function() {
		var newLocationsData = getLocations();
		newLocations(newLocationsData);
	});

	var loadJSON = loadJSONFn();

	loadJSON('/data/static-data.json',
		function(data) {
			//init app here
			init(data);
		},
		function(status) {
			console.log('there was an error: ' + status);
		});

	//main app init
	function init(newData) {
		locationsData = newData;
		//console.log('locationsData', locationsData);
		localStorage.setItem('locationsData' , locationsData);

		var myP5 = new P5(function(sketch) {
			var numLocations = Object.keys(locationsData).length;
			var organNotes = [];

			sketch.preload = function() {
				
				for (var i = numLocations - 1; i >= 0; i--) {
					var thisSound = sketch.loadSound('/audio/organ-C2.mp3');
					organNotes.push(thisSound);
					
				}
			};

			function mapPlaySounds(newLocations) {
				var num = 0;
				var theData = null;
				if (newLocations === undefined) {
					theData = locationsData;
				}
				else {
					theData = newLocations;
				}
				for (var i in theData) {
					organNotes[num].loop();

					//Wind Bearing
					//In degrees
					var thisBearing = theData[num].bearing;
					var pitch = sketch.map(thisBearing, 0, 360, 0.1, 2.0);
	  				console.log('pitch', pitch);
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
	  				var thisSpeed = Math.round(theData[num].speed);
					var volume = sketch.map(thisSpeed, 0, 32, 0.4, 1.0);
					console.log('volume', volume);
	  				organNotes[i].amp(volume);
					organNotes[i].rate(pitch);
					num++;
				}
			}

			function newLocations(data) {
				return data;
			}

			sketch.setup = function setup() {
				var myCanvas = sketch.createCanvas(800,600);
				myCanvas.parent('canvas-container');
				sketch.background(0,0,0);
				//init sounds
				mapPlaySounds();
				
			};

			sketch.draw = function draw() {
				sketch.background(0, 0, 0);
				sketch.noStroke();
				sketch.fill(255);

				if(newLocations() !== undefined ) {
					mapPlaySounds(newLocations());
				}

			};

		}, 'canvas-container');

		return myP5;
	}

	return true;
};
