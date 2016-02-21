'use strict';

var Forecastio = require('../libs/forecast.io');
var Lsb = require('./lsb-cnstrctr');
var Nll = require('./nll-cnstrctr');

module.exports = function(context) {

	var lat = context.getElementById('lat').value;
	var long = context.getElementById('long').value;
	var name = 'Here';
	var newLocation = new Nll(lat, long, name);

	var forecast = new Forecastio({
		PROXY_SCRIPT: '/proxy.php'
	});

	forecast.getCurrentConditions(newLocation, function(conditions) {
		var locationsSpeedBearing = [];
		for (var i = 0; i < conditions.length; i++) {
			var speed = conditions[i].getWindSpeed();
			var bearing = conditions[i].getWindBearing();
			var name = newLocation[i].name;
			var locSpeedBearing = new Lsb(speed, bearing, name);
			locationsSpeedBearing.push(locSpeedBearing);
		}
		console.log('locationsSpeedBearing', locationsSpeedBearing);
		//dataDone(locationsSpeedBearing);
	});
};