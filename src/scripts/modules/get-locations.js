'use strict';

var Forecastio = require('../libs/forecast.io');
var locations = require('./locations');

module.exports = function(dataDone) {

	function LocSpeedBearing(speed, bearing, name) {
		this.speed = speed;
		this.bearing = bearing;
		this.name = name;
	}

	var forecast = new Forecastio({
		PROXY_SCRIPT: '/proxy.php'
	});

	forecast.getCurrentConditions(locations, function(conditions) {
		var locationsSpeedBearing = [];
		for (var i = 0; i < conditions.length; i++) {
			var speed = conditions[i].getWindSpeed();
			console.log('speed', speed);
			var bearing = conditions[i].getWindBearing();
			var name = locations[i].name;
			var locSpeedBearing = new LocSpeedBearing(speed, bearing, name);
			locationsSpeedBearing.push(locSpeedBearing);
		}
		dataDone(locationsSpeedBearing);
	});
};