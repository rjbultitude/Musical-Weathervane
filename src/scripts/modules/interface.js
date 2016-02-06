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
	var newDataReady = false;

	/*
		Ranges to be mapped
	 */
	//Wind Bearing in degrees
	var bearingMin = 0;
	var bearingMax = 360;
	//Pitch arbitary scale
	var pitchMin = 0.1;
	var pitchMax = 2.0;
	//Wind speed typically up to  32m/s
	var speedMin = 0;
	var speedMax = 32;
	//Volume arbitary scale
	var volumeMin = 0.1;
	var volumeMax = 1.0;
	//Shape size
	var radiusMin = 10;
	var radiusMax = 100;

	//Get initial dataset
	loadJSON('/data/static-data.json',
		function(data) {
			console.log('data', data);
			//init app here
			init(data);
		},
		function(status) {
			console.log('there was an error: ' + status);
		});

	//main app init
	function init(startData) {
		var locationsData = startData;
		var numKeys = Object.keys(locationsData).length;
		//TODO store offline
		//localStorage.setItem('locationsData' , locationsData);

		var myP5 = new P5(function(sketch) {

			//The rate at which to detune
			//TODO Needs to be refactored to be
			//independant of the processor speed
			//The higher the number the bigger the loop
			//amend with caution
			var factor = 2250;

			//add sounds to locactions object when ready
			sketch.preload = function() {
				for (var loc in locationsData) {
					//loadSound called during preload
					//will be ready to play in time for setup
					locationsData[loc].sound = sketch.loadSound('/audio/organ-C2.mp3');
				}
			};

			/*
				Main Object config
			 */
			function mapPlaySounds() {
				if (locationsData === undefined) {
					console.log('No location object');
				}
				for (var loc in locationsData) {

					locationsData[loc].sound.loop();

					//Use toFixed?
					locationsData[loc].pitch = sketch.map(locationsData[loc].bearing, bearingMin, bearingMax, pitchMin, pitchMax);
					locationsData[loc].angle = locationsData[loc].bearing;
	  				
	  				//Wind Speed
	  				//Typically between 0 & 32 m/s
					locationsData[loc].volume = sketch.map(Math.round(locationsData[loc].speed), speedMin, speedMax, volumeMin, volumeMax);
					var radiusNum = sketch.map(Math.round(locationsData[loc].speed), speedMin, speedMax, radiusMin, radiusMax);
					locationsData[loc].radius = Math.round(radiusNum);

	  				locationsData[loc].sound.amp(locationsData[loc].volume);
	  				//locationsData[loc].sound.amp(1); //full volume
					locationsData[loc].sound.rate(locationsData[loc].pitch);
				}
				//Create shapes now we have radius
				createShapes();				
				//Poll for 1st time
				pollForecast();
			}

			function pollForecast() {
				//timeOut for dev mode
				//setInterval for prod
				setTimeout(function() {
				//setInterval(function() {
					var dataMatch = false;
					//This is asychronous
					getLocations(function(newLocationData) {
						dataCheckLoop:
						for (var newLoc in newLocationData) {
							for (var loc in locationsData) {
								//If any bearing data is different then break
								//Only compare bearing data for now
								//if (newLocationData[newLoc].bearing !== locationsData[loc].bearing && newLocationData[newLoc].spped !== locationsData[loc].spped) {
								if (newLocationData[newLoc].bearing !== locationsData[loc].bearing) {
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
							compareData(newLocationData);
						}
					});
				}, pollInterval);
			}

			function compareData(newData) {
				newDataReady = false;
				//Warnings
				if (newData === undefined) {
					console.log('no data was passed in');
					return false;
				}
				else if (Object.keys(newData).length !== Object.keys(locationsData).length) {
					console.log('data doesn\'t match. No. of objs is different');
					return false;
				}

				//loop through locations
				for (var loc in locationsData) {
					//compare bearings and speed
					locationsData[loc].newBearing = newData[loc].bearing;
					locationsData[loc].newSpeed = newData[loc].speed;
					locationsData[loc].newPitch = sketch.map(locationsData[loc].newBearing, bearingMin, bearingMax, pitchMin, pitchMax);

					locationsData[loc].newVolume = sketch.map(Math.round(locationsData[loc].newSpeed), speedMin, speedMax, volumeMin, volumeMax);
					var newRadiusNum = sketch.map(Math.round(locationsData[loc].newSpeed), speedMin, speedMax, radiusMin, radiusMax);
					locationsData[loc].newRadius = Math.round(newRadiusNum);

					//calculate difference 
					//to inform increment for this location
					//and ensure it's a positive number
					locationsData[loc].pitchDiff = Math.abs(locationsData[loc].pitch - locationsData[loc].newPitch);
					locationsData[loc].shapeDiff = Math.abs(locationsData[loc].radius - locationsData[loc].newRadius);
					locationsData[loc].incAmt = locationsData[loc].pitchDiff / factor;
					locationsData[loc].incAmtShape = locationsData[loc].shapeDiff / factor;
				}
				newDataReady = true;
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
						locationsData[loc].radius += locationsData[loc].incAmtShape;
					}
					else if (locationsData[loc].newPitch < locationsData[loc].pitch) {
						locationsData[loc].pitch -= locationsData[loc].incAmt;
						locationsData[loc].radius -= locationsData[loc].incAmtShape;
					}
					console.log('loc', loc);
					//Set new shape size?
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
					locationsData[loc].speed = locationsData[loc].newSpeed;
					locationsData[loc].bearing = locationsData[loc].newBearing;
					locationsData[loc].radius = locationsData[loc].newRadius;
				}
				console.log('data overwritten');
			}

			function LocationSound(sound) {
				this.sound = sound;
			}

			//LocationSound.prototype

			function LocationShape(xPos, yPos, radius, name) {
				this.xPos = xPos;
				this.yPos = yPos;
				this.radius = radius;
				//this.angle = angle; //TODO
				this.name = name;
			}

			LocationShape.prototype.paint = function() {
				sketch.noStroke();
				sketch.fill(255,255,255);
				sketch.ellipse(this.xPos, this.yPos, this.radius, this.radius);
				sketch.textSize(18);
				sketch.textAlign(sketch.CENTER);
				sketch.text(this.name, this.xPos, this.yPos - radiusMax);
				sketch.text(this.radius.toFixed(2), this.xPos, this.yPos + radiusMax);
			};

			LocationShape.prototype.update = function(newRadius) {
				if (newRadius !== undefined) {
					var diff = Math.round(Math.abs(this.radius - newRadius));
					var factor = 1;
					console.log('this.radius', this.radius);
					console.log('newRadius', newRadius);
					if (this.radius > newRadius) {
						this.radius -= 1/factor;
					}
					else if (this.radius < newRadius) {
						this.radius += 1/factor;
					}
					else if (this.radius === newRadius) {
						console.log('same');
					}
				}
			};

			function createShapes() {
				/*
					Positions
	 			*/
				var horizDiv = sketch.width/numKeys;
				var horizOffset = horizDiv/2;
				for (var i = 0; i < numKeys; i++) {
					var newLocationShape = new LocationShape((horizDiv * i) + horizOffset, sketch.height/2, locationsData[i].radius, locationsData[i].name);				
					locationsData[i].locShape = newLocationShape;
				}
			}

			sketch.setup = function setup() {
				//Canvas setup
				var myCanvas = sketch.createCanvas(700,500);
				myCanvas.parent('canvas-container');
				sketch.background(0,0,0);
				sketch.frameRate(20);
				//init sounds
				//Must only be called once
				mapPlaySounds();
				sketch.background(0, 0, 0);
				for (var i = 0; i < locationsData.length; i++) {
					locationsData[i].locShape.update(locationsData[i].radius);
					locationsData[i].locShape.paint();
				}
			};

			sketch.draw = function draw() {
				if (newDataReady) {
					//once calculations are complete: retune
					//adjustVolume();
					//tunePitch();
					sketch.background(0, 0, 0);
					for (var i = 0; i < locationsData.length; i++) {
						locationsData[i].locShape.update(locationsData[i].newRadius);
						locationsData[i].locShape.paint();
						locationsData[i].volume = locationsData[i].newVolume;
						locationsData[i].pitch = locationsData[i].newPitch;
						locationsData[i].sound.amp(locationsData[i].volume);
						locationsData[i].sound.rate(locationsData[i].pitch);
					}
				}
			};

		}, 'canvas-container');

		return myP5;
	}

	return true;
};
