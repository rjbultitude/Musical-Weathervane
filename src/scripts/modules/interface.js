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
			var factor = 200000;

			//add sounds to locactions object when ready
			sketch.preload = function() {
				for (var loc in locationsData) {
					//loadSound called during preload
					//will be ready to play in time for setup
					locationsData[loc].sound = sketch.loadSound('/audio/organ-C2.mp3');
				}
			};

			//Initialise load new data button 
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
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
					locationsData[loc].volume = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 0.4, 1.0);
	  				//locationsData[loc].sound.amp(locationsData[loc].volume);
	  				locationsData[loc].sound.amp(1);
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
					//calculate fifference 
					//to inform increment for this location
					//and ensure it's a positive number
					locationsData[loc].pitchDiff = Math.abs(locationsData[loc].pitch - locationsData[loc].newPitch);
					locationsData[loc].incAmt = locationsData[loc].pitchDiff / factor;
				}
				//once calculations are complete: retune
				tunePitch();
			}

			function tunePitch() {
				var numKeys = Object.keys(locationsData).length;
				var loopNum = numKeys * factor;
				var loc = 0;
				dataLoop:
				for (var i = 0; i < loopNum; i++) {
					//Pitch tune logic
					if (locationsData[loc].pitch === locationsData[loc].newPitch) {
						console.log('' + loc + ' is same');
						if (loc < numKeys -1) {
							loc++;
							//if current pitch and new pitch match move to the next location
							continue dataLoop;
						}
						else {
							//if all have been checked then stop
							break;
						}
					}
					else if (locationsData[loc].newPitch > locationsData[loc].pitch) {
						locationsData[loc].pitch += locationsData[loc].incAmt;
						//console.log('add', locationsData[loc].pitch);
					}
					else if (locationsData[loc].newPitch < locationsData[loc].pitch) {
						locationsData[loc].pitch -= locationsData[loc].incAmt;
						//console.log('subtract', locationsData[loc].pitch);
					}
					//Set new pitch
					locationsData[loc].sound.rate(locationsData[loc].pitch);
					//Move to next loc obj
					loc++;
					//Loop through loc objects array again
					if (loc === Object.keys(locationsData).length) {
						loc = 0;
					}
					//console.log('loc ' + loc + ' done');
				}
				console.log('d', locationsData);
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
