'use strict';

var Forecastio = require('./forecastio');
var when = require('when');
var rest = require('rest');

module.exports = function() {

	var locationWindObj = [];

	var locations = {
		brixton: {
			latitude: '51.461279',
			longitude: '-0.115615'
		},
		birkenhead: {
			latitude: '53.389991',
			longitude: '-3.023009'
		},
		bradford: {
			latitude: '53.795984',
			longitude: '-1.759398'
		}
	};

	function ready(dataJOSN) {
		var tempObj = {
			bearing: dataJOSN.getWindSpeed(), 
			speed: dataJOSN.getWindBearing()
		};
		locationWindObj.push(tempObj);
	}
	var forecast;
	forecast = new Forecastio({
		PROXY_SCRIPT: '/proxy.php'
	});
	console.log('forecast', forecast);
	//init();
	for (var loc in locations) {
		forecast.getCurrentConditions(locations[loc].latitude, locations[loc].longitude, ready);
	}
	//TODO
	//This needs to be handled asychronously
	if (locationWindObj.length === Object.keys(locations).length) {
		return locationWindObj;
	}
};