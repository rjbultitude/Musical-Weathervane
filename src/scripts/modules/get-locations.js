'use strict';

var Forecastio = require('../libs/forecast.io');
var locations = require('./locations');
console.log('locations', locations);

module.exports = function(dataDone) {

	function LocSpeedBearing(speed, bearing) {
		this.speed = speed;
		this.bearing = bearing;
	}

	var forecast = new Forecastio({
		PROXY_SCRIPT: '/proxy.php'
	});

	forecast.getCurrentConditions(locations, function(conditions) {
		var locationsSpeedBearing = [];
		for (var i = 0; i < conditions.length; i++) {
			var speed = conditions[i].getWindSpeed();
			var bearing = conditions[i].getWindBearing();
			var locSpeedBearing = new LocSpeedBearing(speed, bearing);
			console.log('locSpeedBearing', locSpeedBearing);
			locationsSpeedBearing.push(locSpeedBearing);
		}
		dataDone(locationsSpeedBearing);
	});
};