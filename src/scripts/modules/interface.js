'use strict';

var	getLocations = require('./get-locations');
var locationsData = null;
var loadJSONFn = require('./load-json');
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {
	//load JSON parser/loader
	var loadJSON = loadJSONFn();

	//Get initial dataset
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
		localStorage.setItem('locationsData' , locationsData);

		var myP5 = new P5(function(sketch) {

			//The rate at which to detune
			var incAmt = 0.02;

			sketch.preload = function() {
				for (var loc in locationsData) {
					locationsData[loc].sound = sketch.loadSound('/audio/organ-C2.mp3');
				}
			};

			function initBtn() {
				var loadNewDataBtn = document.getElementById('load');
				loadNewDataBtn.addEventListener('click', function() {

					loadJSON('/data/static-data2.json',
					function(data) {
						//var newLocationsData = getLocations();
						compareData(data);
					},
					function(status) {
						console.log('there was an error: ' + status);
					});
				});
			}

			function mapPlaySounds() {
				if (locationsData === undefined) {
					console.log('No location object');
				}
				for (var loc in locationsData) {
					locationsData[loc].sound.loop();

					//Wind Bearing
					//In degrees
					locationsData[loc].pitch = sketch.map(locationsData[loc].bearing, 0, 360, 0.1, 2.0);
	  				//console.log('pitch', pitch);
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
					locationsData[loc].volume = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 0.4, 1.0);
					//console.log('volume', volume);
					//
	  				locationsData[loc].sound.amp(locationsData[loc].volume);
					locationsData[loc].sound.rate(locationsData[loc].pitch);
				}
			}

			function compareData(newData) {
				//Warnings
				if (newData === undefined) {
					console.log('no data was passed in');
					return;
				}
				else if (Object.keys(newData).length !== Object.keys(locationsData).length) {
					console.log('data doesn\'t match');
				}

				//loop through locations
				for (var loc in locationsData) {
					//compare bearings
					locationsData[loc].newBearing = newData[loc].bearing;
					locationsData[loc].newPitch = sketch.map(locationsData[loc].newBearing, 0, 360, 0.1, 2.0);
					locationsData[loc].pitchDiff = Math.abs(locationsData[loc].pitch - locationsData[loc].newPitch);
					locationsData[loc].incAmt = locationsData[loc].pitchDiff / 12;
				}
				//once calculations are complete retune
				tunePitch();
			}

			function tunePitch() {
				dataLoop:
				for (var loc in locationsData) {
					var loopCount = 0;
					//if current and new match move to the next location
					if (locationsData[loc].pitch === locationsData[loc].newPitch) {
						continue dataLoop;
					}
					else {
						//Pitch tune loops
						posLoop:
						while (locationsData[loc].newPitch > locationsData[loc].pitch) {
							locationsData[loc].sound.rate(locationsData[loc].pitch);
							locationsData[loc].pitch += locationsData[loc].incAmt;
							console.log('add', locationsData[loc].pitch);
							loopCount++;
							continue dataLoop;
							//break;
						}
						negLoop:
						while (locationsData[loc].newPitch < locationsData[loc].pitch) {
							locationsData[loc].sound.rate(locationsData[loc].pitch);
							locationsData[loc].pitch -= locationsData[loc].incAmt;
							console.log('subtract', locationsData[loc].pitch);
							loopCount++;
							continue dataLoop;
							//break;
						}
						console.log('loopCount', loopCount);
					}
					console.log('loc ' + loc + ' done');
					console.log('d', locationsData[loc]);
				}
			}

			sketch.setup = function setup() {
				var myCanvas = sketch.createCanvas(800,200);
				myCanvas.parent('canvas-container');
				sketch.background(0,0,0);
				//init sounds
				mapPlaySounds();
				initBtn();
				//setInterval(compareData, 5000);
				
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
