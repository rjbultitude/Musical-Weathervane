'use strict';

var Forecastio = require('../libs/forecast.io');
var Lsb = require('./lsb-cnstrctr');
var Nll = require('./nll-cnstrctr');
var postal = require('postal');
var channel = postal.channel();

module.exports = function() {
	var coordsSubmitBtn = document.getElementById('form-coords-btn');
	var useLocBtn = document.getElementById('use-location-btn');
	var messageBlock = document.getElementById('message-block');

	function updateApp(lat, long) {
		var name = 'here';
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
				channel.publish('userUpdate', locSpeedBearing);
			}
		});
	}

	function showForm() {
		messageBlock.innerHtml = '<p>Geolocation is not supported by your browser</p>' +
									'<p>Try searching</p>';
		//TODO
		//Reveal form in page and use fields
		var lat = document.getElementById('lat').value;
		var long = document.getElementById('long').value;
		updateApp();
	}

	function getGeo() {
		if (!navigator.geolocation) {
			showForm();
			return;
		}

		function success(position) {
			updateApp(position.coords.latitude, position.coords.longitude);
		}

		function error() {
			console.log('Unable to retrieve your location');
		}

		navigator.geolocation.getCurrentPosition(success, error);
	}

	useLocBtn.addEventListener('click', function(e) {
		e.preventDefault();
		channel.publish('fetchingUserLoc', null);
		getGeo();
	});
};