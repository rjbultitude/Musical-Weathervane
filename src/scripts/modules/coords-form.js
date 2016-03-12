'use strict';

var Forecastio = require('../libs/forecast.io');
var Lsb = require('./lsb-cnstrctr');
var Nll = require('./nll-cnstrctr');
var locations = require('./locations');

module.exports = function(dataDone) {
	var submitBtn = document.getElementById('submit');
	submitBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var lat = document.getElementById('lat').value;
		var long = document.getElementById('long').value;
		var name = 'Here';
		var newLocation = new Nll(lat, long, name);
		var newLocationArr = [newLocation];

		var forecast = new Forecastio({
			PROXY_SCRIPT: '/proxy.php'
		});

		forecast.getCurrentConditions(newLocationArr, function(conditions) {
			console.log('conditions', conditions);
			var locationsSpeedBearing = [];
			for (var i = 0; i < conditions.length; i++) {
				var speed = conditions[i].getWindSpeed();
				var bearing = conditions[i].getWindBearing();
				var name = newLocation[i].name;
				var locSpeedBearing = new Lsb(speed, bearing, name);
				locationsSpeedBearing.push(locSpeedBearing);
			}
			//console.log('locationsSpeedBearing', locationsSpeedBearing);
			dataDone(locationsSpeedBearing);
		});
	});
};