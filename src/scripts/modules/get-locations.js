'use strict';

var Forecastio = require('../libs/forecast.io');
var locations = require('./locations');
var Lsb = require('./lsb-cnstrctr');

module.exports = function(dataDone) {

	var forecast = new Forecastio({
		PROXY_SCRIPT: '/proxy.php'
	});

	forecast.getCurrentConditions(locations, function(conditions) {
		var locationsSpeedBearing = [];
		for (var i = 0; i < conditions.length; i++) {
			var speed = conditions[i].getWindSpeed();
			var bearing = conditions[i].getWindBearing();
			var name = locations[i].name;
			var locSpeedBearing = new Lsb(speed, bearing, name);
			locationsSpeedBearing.push(locSpeedBearing);
		}
		dataDone(locationsSpeedBearing);
	});
};