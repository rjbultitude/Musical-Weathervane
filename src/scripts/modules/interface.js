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
var getLocations = require('./get-locations');
var coordsForm = require('./coords-form');
var P5 = require('../libs/p5');
require('../libs/p5.sound');
var postal = require('postal');
var channel = postal.channel();

module.exports = function() {
	//load JSON parser/loader
	var loadJSON = loadJSONFn();
	//Frequency of data polling
	var pollInterval = 3600; //0.001 hours
	var staticDataReady = false;
	var newDataReady = false;
	var polling = false;
	var fetchingUsrLoc = false;
	//String consts
	var pollingMsgStr = 'Fetching new weather data';
	var userMsgStr = 'Fetching your weather data';

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
	//Pitch diffs global
	var pitchDiffArr = [];
	//line length
	var bearingLineLength = 40;

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
			var factor = 20;

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
					//Wind Bearing
					locationsData[loc].pitch = sketch.map(locationsData[loc].bearing, bearingMin, bearingMax, pitchMin, pitchMax);

					//Wind Speed
					locationsData[loc].volume = sketch.map(Math.round(locationsData[loc].speed), speedMin, speedMax, volumeMin, volumeMax);
					var radiusNum = sketch.map(Math.round(locationsData[loc].speed), speedMin, speedMax, radiusMin, radiusMax);
					locationsData[loc].radius = Math.round(radiusNum);
				}

				locationsData[loc].sound.amp(locationsData[loc].volume);
				//locationsData[loc].sound.amp(1); //full volume
				locationsData[loc].sound.rate(locationsData[loc].pitch);

				//Update location data now we have values
				locationsData = createLocations();
				//Draw
				staticDataReady = true;
				//Poll for 1st time
				pollForecast();
				//Init Form
				formInit();
			}

			function showUserMessage() {
				sketch.textSize(14);
				sketch.textAlign(sketch.CENTER);
				sketch.fill(255, 255, 255);
				sketch.text(userMsgStr, sketch.width / 2, 30);
			}

			function showPollingMessage() {
				sketch.textSize(14);
				sketch.textAlign(sketch.CENTER);
				sketch.fill(255, 255, 255);
				sketch.text(pollingMsgStr, sketch.width / 2, 30);
			}

			function formInit() {
				coordsForm();
				channel.subscribe('fetchingUserLoc', function() {
					fetchingUsrLoc = true;
				});
				channel.subscribe('userUpdate', function(data) {
					// console.log('data from form', data);
					updateSingleLoc(data);
				});
			}

			function pollForecast() {
				//timeOut for dev mode
				//setInterval for prod
				setTimeout(function() {
					//setInterval(function() {
					var dataMatch = false;
					//Loading message
					polling = true;
					//This is asychronous
					getLocations(function(newLocationData) {
						dataCheckLoop: for (var newLoc in newLocationData) {
								for (var loc in locationsData) {
									//If any bearing data is different stop
									//Only compare bearing data for now
									if (newLocationData[newLoc].bearing !== locationsData[loc].bearing) {
										dataMatch = false;
										break;
									} else {
										dataMatch = true;
										continue dataCheckLoop;
									}
								}
							}
							//If all of the above were true do nothing
							//if not continue with app
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
				//Are we comparing a complete set of locations
				if (Object.keys(newData).length !== Object.keys(locationsData).length) {
					console.log('data doesn\'t match. No. of objs is different');
					return false;
				} else {
					updateLocData(newData);
				}
			}

			function updateSingleLoc(newData) {
				locationsData[1].newBearing = newData.bearing;
				locationsData[1].newSpeed = newData.speed;
				locationsData[1].newName = newData.name;
				//Manage audio/visual facets
				locationsData[1].newPitch = sketch.map(locationsData[1].newBearing, bearingMin, bearingMax, pitchMin, pitchMax);
				locationsData[1].newVolume = sketch.map(Math.round(locationsData[1].newSpeed), speedMin, speedMax, volumeMin, volumeMax);
				var newRadiusNum = sketch.map(Math.round(locationsData[1].newSpeed), speedMin, speedMax, radiusMin, radiusMax);
				locationsData[1].newRadius = Math.round(newRadiusNum);

				//calculate differences 
				//and ensure it's a positive number
				locationsData[1].pitchDiff = Math.abs(locationsData[1].pitch - locationsData[1].newPitch);
				pitchDiffArr.push(locationsData[1].pitchDiff);
				locationsData[1].shapeDiff = Math.abs(locationsData[1].radius - locationsData[1].newRadius);
				locationsData[1].incAmt = locationsData[1].pitchDiff / factor;
				fetchingUsrLoc = false;
			}

			function updateLocData(newData) {
				//loop through locations
				//TODO should be for loop
				for (var loc in locationsData) {
					//compare bearings and speed
					if (newData[loc] !== undefined) {
						locationsData[loc].newBearing = newData[loc].bearing;
						locationsData[loc].newSpeed = newData[loc].speed;
						locationsData[loc].newName = newData[loc].name;
						//Manage audio/visual facets
						locationsData[loc].newPitch = sketch.map(locationsData[loc].newBearing, bearingMin, bearingMax, pitchMin, pitchMax);
						locationsData[loc].newVolume = sketch.map(Math.round(locationsData[loc].newSpeed), speedMin, speedMax, volumeMin, volumeMax);
						var newRadiusNum = sketch.map(Math.round(locationsData[loc].newSpeed), speedMin, speedMax, radiusMin, radiusMax);
						locationsData[loc].newRadius = Math.round(newRadiusNum);

						//calculate differences 
						//and ensure it's a positive number
						locationsData[loc].pitchDiff = Math.abs(locationsData[loc].pitch - locationsData[loc].newPitch);
						pitchDiffArr.push(locationsData[loc].pitchDiff);
						locationsData[loc].shapeDiff = Math.abs(locationsData[loc].radius - locationsData[loc].newRadius);
						locationsData[loc].incAmt = locationsData[loc].pitchDiff / factor;
						// console.log('locationsData[loc].pitch', locationsData[loc].pitch);
						// console.log('locationsData[loc].newPitch', locationsData[loc].newPitch);
					}
				}
				polling = false;
				newDataReady = true;
				staticDataReady = false;
			}

			//Location Class
			function LocationObj(speed, bearing, pitch, volume, newPitch, newVolume, pitchDiff, incAmt, name, radius, xPos, yPos, sound) {
				this.speed = speed;
				this.bearing = bearing;
				this.name = name;
				this.radius = radius;
				this.pitch = pitch;
				this.newPitch = newPitch;
				this.volume = volume;
				this.newVolume = newVolume;
				this.xPos = xPos;
				this.yPos = yPos;
				this.pitchDiff = pitchDiff;
				this.incAmt = incAmt;
				this.sound = sound;
				this.soundSame = false;
			}

			LocationObj.prototype.shapePaint = function() {
				sketch.noStroke();
				sketch.fill(255, 255, 255, 100);
				sketch.ellipse(this.xPos, this.yPos, this.radius, this.radius);
				sketch.stroke(255, 255, 255);
				sketch.line(this.xPos, this.yPos, this.xPos + (sketch.sin(this.bearing / sketch.TWO_PI) * bearingLineLength), this.yPos + (sketch.cos(this.bearing / sketch.TWO_PI)) * bearingLineLength);
				sketch.textSize(18);
				sketch.textAlign(sketch.CENTER);
				sketch.noStroke();
				sketch.fill(255, 255, 255, 255);
				sketch.text(this.name, this.xPos, this.yPos - radiusMax);
				sketch.text('Speed', this.xPos, this.yPos + radiusMax);
				sketch.text(this.radius.toFixed(2), this.xPos, this.yPos + radiusMax + radiusMax/4);
				sketch.text('Bearing', this.xPos, this.yPos + radiusMax + radiusMax/2);
				sketch.text(this.bearing, this.xPos, this.yPos + radiusMax + (radiusMax/4 * 3));
			};

			LocationObj.prototype.shapeUpdate = function() {
				if (this.newRadius !== undefined) {
					var factor = 1;
					if (this.radius > this.newRadius) {
						this.radius -= 1 / factor;
					} else if (this.radius < this.newRadius) {
						this.radius += 1 / factor;
					} else if (this.radius === this.newRadius) {
						//console.log('same');
					}
				}
			};

			LocationObj.prototype.angleUpdate = function() {
				if (this.newBearing !== undefined) {
					if (this.bearing > this.newBearing) {
						this.bearing -= 1;
					} else if (this.bearing < this.newBearing) {
						this.bearing += 1;
					} else if (this.bearing === this.newBearing) {
						//console.log('same');
					}
				}
			};

			LocationObj.prototype.soundUpdate = function() {
				//TODO
				//locationsData[i].sound.amp();
				// Use approximate values
				if (this.pitch.toFixed(2) / 1 > this.newPitch.toFixed(2) / 1) {
					this.pitch -= this.incAmt;
					this.sound.rate(this.pitch);
					//console.log('this.pitch', this.pitch);
				} else if (this.pitch.toFixed(2) / 1 < this.newPitch.toFixed(2) / 1) {
					this.pitch += this.incAmt;
					this.sound.rate(this.pitch);
					//console.log('this.pitch', this.pitch);
				}
				//might have to use a range here
				else if (this.pitch.toFixed(2) / 1 === this.newPitch.toFixed(2) / 1) {
					this.soundSame = true;
				}
			};

			LocationObj.prototype.nameUpdate = function() {
				if (this.newName !== undefined) {
					this.name = this.newName;
				}
			};

			function createLocations() {
				var finalLocsArr = [];
				var horizDiv = sketch.width / numKeys;
				var horizOffset = horizDiv / 2;
				for (var i = 0; i < numKeys; i++) {
					var newLocationObj = new LocationObj(locationsData[i].speed, locationsData[i].bearing, locationsData[i].pitch, locationsData[i].volume, locationsData[i].newPitch, locationsData[i].newVolume, locationsData[i].pitchDiff, locationsData[i].incAmt, locationsData[i].name, locationsData[i].radius, (horizDiv * i) + horizOffset, sketch.height/2 - 40, locationsData[i].sound);
					finalLocsArr[i] = newLocationObj;
				}
				return finalLocsArr;
			}

			sketch.setup = function setup() {
				//Canvas setup
				var myCanvas = sketch.createCanvas(800, 400);
				myCanvas.parent('canvas-container');
				sketch.frameRate(25);
				//init sounds
				//Must only be called once
				sketch.background(0, 0, 0);
				mapPlaySounds();
			};

			sketch.draw = function draw() {
				sketch.background(0, 0, 0);
				if (polling) {
					showPollingMessage();
				}
				if (fetchingUsrLoc) {
					showUserMessage();
				}
				paintUpdateLoop:
					for (var i = 0; i < locationsData.length; i++) {
						locationsData[i].shapePaint();
						locationsData[i].shapeUpdate();
						locationsData[i].angleUpdate();
						locationsData[i].nameUpdate();
						if (newDataReady !== true) {
							continue;
						}
						locationsData[i].soundUpdate();
					}
			};

		}, 'canvas-container');

		return myP5;
	}

	return true;
};