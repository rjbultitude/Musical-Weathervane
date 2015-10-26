'use strict';

var	getLocations = require('./get-locations');
var locationsData = null;
var loadJSONFn = require('./load-json');
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {

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

			function initBtn() {
				var loadNewDataBtn = document.getElementById('load');
				loadNewDataBtn.addEventListener('click', function() {
					var newLocationsData = getLocations();
					mapPlayCurrNew(newLocationsData);
				});
			}

			function mapPlaySounds(currLocations) {
				if (currLocations === undefined) {
					console.log('No data passed in');
				}
				var num = 0;
				for (var i in currLocations) {
					organNotes[num].loop();

					//Wind Bearing
					//In degrees
					var thisBearing = currLocations[num].bearing;
					var pitch = sketch.map(thisBearing, 0, 360, 0.1, 2.0);
	  				console.log('pitch', pitch);
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
	  				var thisSpeed = Math.round(currLocations[num].speed);
					var volume = sketch.map(thisSpeed, 0, 32, 0.4, 1.0);
					console.log('volume', volume);
	  				organNotes[i].amp(volume);
					organNotes[i].rate(pitch);
					num++;
				}
			}

			function mapPlayCurrNew(currLocations, newLocations) {
				var num = 0;
				//loop through locations
				for (var note in organNotes) {
					//compare bearings
					var thisBearing = currLocations[num].bearing;
					var thatBearing = newLocations[num].bearing;
					var newPitch = sketch.map(thisBearing, 0, 360, 0.1, 2.0);
					if (thisBearing !== thatBearing) {
						var bearingDiff = thisBearing - thatBearing;
						var bearingInc = bearingDiff / 0.2;
						for (var i = bearingInc - 1; i >= 0; i--) {
							organNotes[i].rate(newPitch);
							newPitch += 0.2;
						}
					}
				}
				num ++;
			}

			sketch.setup = function setup() {
				var myCanvas = sketch.createCanvas(800,200);
				myCanvas.parent('canvas-container');
				sketch.background(0,0,0);
				//init sounds
				mapPlaySounds(newData);
				initBtn();
				
			};

			sketch.draw = function draw() {
				sketch.background(0, 0, 0);
				sketch.noStroke();
				sketch.fill(255);
			};

		}, 'canvas-container');

		return myP5;
	}

	return true;
};
