/*
	This module loads and converts the data
	Three locations are used as the data sources

	Each location's properties are used to inform the shape of the sounds
	Wind bearing is mapped to used for the pitch
	Wind speed for volume
	
	When new data is loaded the pitch of each note is retuned
	This is done by ensuring the loop is re-entered after each pass of all three objects
	However it relies on a for loop, which is run at the speed of the client's computer
	This flaw needs addressing
 */

/*
	Location Harminiser
 */

'use strict';

var loadJSONFn = require('./load-json');
var	getLocations = require('./get-locations');
var P5 = require('../libs/p5');
require('../libs/p5.sound');

module.exports = function() {
	//load JSON parser/loader
	var loadJSON = loadJSONFn();
	//Frequency of data polling
	var pollInterval = 3600; //0.001 hours

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
		var locationsData = newData;
		var numKeys = Object.keys(locationsData).length;
		//TODO store offline
		//localStorage.setItem('locationsData' , locationsData);

		var myP5 = new P5(function(sketch) {

			//The rate at which to detune
			//Needs to be refactored to be
			//independant of the processor speed
			var factor = 200000;
			//Array for shape Objects
			var locationShapes = [];

			//add sounds to locactions object when ready
			sketch.preload = function() {
				for (var loc in locationsData) {
					//loadSound called during preload
					//will be ready to play in time for setup
					locationsData[loc].sound = sketch.loadSound('/audio/organ-C2.mp3');
				}
			};

			function pollForecast() {
				//timeOut for dev mode
				//setInterval for prod
				setTimeout(function() {
				//setInterval(function() {
					var dataMatch = false;
					//This is now asychronous
					getLocations(function(locsData) {
						dataCheckLoop:
						for (var newLoc in locsData) {
							for (var loc in locationsData) {
								//If any bearing data is different then break
								//Only compare bearing data for now
								if (locsData[newLoc].bearing !== locationsData[loc].bearing) {
									dataMatch = false;
									break;
								}
								else {
									dataMatch = true;
									continue dataCheckLoop;
								}
							}
						}
						if (dataMatch === false) {
							compareData(locsData);
						}
					});
				}, pollInterval);
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
					locationsData[loc].angle = locationsData[loc].bearing;
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
					locationsData[loc].volume = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 0.4, 1.0);
					locationsData[loc].radius = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 20, 90);

	  				//locationsData[loc].sound.amp(locationsData[loc].volume);
	  				locationsData[loc].sound.amp(1);
					locationsData[loc].sound.rate(locationsData[loc].pitch);
				}
				//Draw for 1st time
				drawShapes();
				//Poll for 1st time
				pollForecast();
			}

			function compareData(newData) {
				//Warnings
				if (newData === undefined) {
					console.log('no data was passed in');
					return;
				}
				else if (Object.keys(newData).length !== Object.keys(locationsData).length) {
					console.log('data doesn\'t match. No of objs is different');
				}

				//loop through locations
				for (var loc in locationsData) {
					//compare bearings
					locationsData[loc].newBearing = newData[loc].bearing;
					locationsData[loc].newPitch = sketch.map(locationsData[loc].newBearing, 0, 360, 0.1, 2.0);

					//Wind Speed
	  				//Typically between 0 & 32 m/s
					locationsData[loc].newVolume = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 0.4, 1.0);
					locationsData[loc].newRadius = sketch.map(Math.round(locationsData[loc].speed), 0, 32, 20, 90);

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
						//animation increase here
						//locationsData[loc].radius += 1;
						//locationShapes[loc].draw(locationsData[loc].radius, locationsData[loc].name);
					}
					else if (locationsData[loc].newPitch < locationsData[loc].pitch) {
						locationsData[loc].pitch -= locationsData[loc].incAmt;
						//animation decrease here
						//locationsData[loc].radius -= 1;
						//locationShapes[loc].draw(locationsData[loc].radius, locationsData[loc].name);
					}
					//Set new pitch
					locationsData[loc].sound.rate(locationsData[loc].pitch);

					//Move to next loc obj
					loc++;
					
					//Loop through loc objects array again
					if (loc === Object.keys(locationsData).length) {
						loc = 0;
					}
				}
				//Overwrite bearing and speed
				overwriteLocData();
			}

			function overwriteLocData() {
				for (var loc in locationsData) {
					//TODO use speed for volume
					//locationsData[loc].speed = locationsData[loc].newSpeed;
					locationsData[loc].bearing = locationsData[loc].newBearing;
				}
			}

			function LocationShape(xPos, yPos, radius) {
				this.xPos = xPos;
				this.yPos = yPos;
				this.radius = radius;
			}

			LocationShape.prototype.draw = function(newRadius, name) {
				console.log('newRadius', newRadius);
				console.log('name', name);
				sketch.fill(255,255,255);
				sketch.ellipse(this.xPos, this.yPos, newRadius, newRadius);
				sketch.textSize(18);
				sketch.text(name, this.xPos, this.yPos - 80);
			};

			function drawShapes() {
				sketch.background(0, 0, 0);
				sketch.noStroke();
				sketch.fill(255);

				for (var i = 0; i < locationShapes.length; i++) {
					locationShapes[i].draw(locationsData[i].radius, locationsData[i].name);
				}
			}

			sketch.setup = function setup() {
				//Canvas setup
				var myCanvas = sketch.createCanvas(800,200);
				myCanvas.parent('canvas-container');
				sketch.background(0,0,0);
				//Visuals
				for (var i = 0; i < numKeys; i++) {
					var third = sketch.width/3;
					var newLocationShape = new LocationShape(third * i, sketch.height/2, 70);
					locationShapes.push(newLocationShape);
				}
				//init sounds
				//Must only be called once
				mapPlaySounds();
			};

			sketch.draw = function draw() {
				//Not needed
			};

		}, 'canvas-container');

		return myP5;
	}

	return true;
};
