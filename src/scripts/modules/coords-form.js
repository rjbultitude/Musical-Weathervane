'use strict';

var Forecastio = require('../libs/forecast.io');
var Lsb = require('./lsb-cnstrctr');
var Nll = require('./nll-cnstrctr');
var postal = require('postal');
var channel = postal.channel();

module.exports = function() {
	var submitBtn = document.getElementById('submit');
	submitBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var lat = document.getElementById('lat').value;
		var long = document.getElementById('long').value;
		var newLocation = new Nll(lat, long, name);

		var forecast = new Forecastio({
			PROXY_SCRIPT: '/proxy.php'
		});

		forecast.getCurrentConditions(newLocation, function(conditions) {
			if (conditions.length === 1) {
				var speed = conditions[0].getWindSpeed();
				var bearing = conditions[0].getWindBearing();
				//TODO get correct name
				var name = 'Here';
				var locSpeedBearing = new Lsb(speed, bearing, name);
				channel.publish('formUpdate', locSpeedBearing);
			}
		});
	});
};