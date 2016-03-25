'use strict';

var Forecastio = require('../libs/forecast.io');
var Lsb = require('./lsb-cnstrctr');
var Nll = require('./nll-cnstrctr');
var GoogleMapsLoader = require('google-maps');
var makeRequest = require('./make-request');
var Promise = require('es6-promise').Promise;
var postal = require('postal');
var channel = postal.channel();

module.exports = function() {
	var coordsSubmitBtn = document.getElementById('form-coords-btn');
	var useLocBtn = document.getElementById('use-location-btn');
	var messageBlock = document.getElementById('message-block');

	function getPlaces(lat, long) {
		var gpKey = makeRequest('GET', '/gm-key.php');
		gpKey.then(function(key) {
			GoogleMapsLoader.KEY = key;
			GoogleMapsLoader.load(function(google) {
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(lat, long);

				geocoder.geocode({
						'latLng': latlng
					},
					function(results, status) {
						var city = 'Your location';
						if (status === google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								var add = results[0].formatted_address;
								var value = add.split(',');
								var count = value.length;
								var city = value[count - 3];
							} else {
								console.log('address not found');
							}
						} 
						else {
							console.log('Geocoder failed due to: ' + status);
						}
						updateApp(lat, long, city);
					}
				);
			});
		});
	}

	function updateApp(lat, long, name) {
		var newLocation = new Nll(lat, long, name);
		var forecast = new Forecastio({
			PROXY_SCRIPT: '/proxy.php'
		});

		forecast.getCurrentConditions(newLocation, function(conditions) {
			if (conditions.length === 1) {
				var speed = conditions[0].getWindSpeed();
				var bearing = conditions[0].getWindBearing();
				//TODO get correct name
				var name = newLocation.name;
				console.log('name', name);
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
		updateApp(lat, long);
	}

	function getGeo() {
		if (!navigator.geolocation) {
			showForm();
			return;
		}

		function success(position) {
			//updateApp(position.coords.latitude, position.coords.longitude);
			getPlaces(position.coords.latitude, position.coords.longitude);
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