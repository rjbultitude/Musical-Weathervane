'use strict';

//var request = require('./request');
var forecastInit = require('./forecastio');


module.exports = function() {

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

	var Forecastio = forecastInit();
	var forecast = new Forecastio({PROXY_SCRIPT: '/proxy.php'});

	//get current conditions
    var conditionBrixton = forecast.getCurrentConditions(locations.brixton.latitude, locations.brixton.longitude);
    var conditionBirkenhead = forecast.getCurrentConditions(locations.birkenhead.latitude, locations.birkenhead.longitude);
    var conditionBradford = forecast.getCurrentConditions(locations.bradford.latitude, locations.bradford.longitude);        

    var windSpeedBrixtonContainer = document.getElementById('speedBrixton');
    var windBearingBrixtonContainer = document.getElementById('bearingBrixton');
    var windSpeedBirkenheadContainer = document.getElementById('speedBirkenhead');
    var windBearingBirkenheadContainer = document.getElementById('bearingBirkenhead');
    var windSpeedBradfordContainer = document.getElementById('speedBradford');
    var windBearingBradfordContainer = document.getElementById('bearingBradford');
    
    var currentWindSpeedBrixton = conditionBrixton.getWindSpeed();
    var currentWindBearingBrixton = conditionBrixton.getWindBearing();
    var currentWindSpeedBirkenhead = conditionBirkenhead.getWindSpeed();
    var currentWindBearingBirkenhead = conditionBirkenhead.getWindBearing();
    var currentWindSpeedBradford = conditionBradford.getWindSpeed();
    var currentWindBearingBradford = conditionBradford.getWindBearing();

    windSpeedBrixtonContainer.innerHTML = currentWindSpeedBrixton;
    windBearingBrixtonContainer.innerHTML = currentWindBearingBrixton;
    windSpeedBirkenheadContainer.innerHTML = currentWindSpeedBirkenhead;
    windBearingBirkenheadContainer.innerHTML = currentWindBearingBirkenhead;
    windSpeedBradfordContainer.innerHTML = currentWindSpeedBradford;
    windBearingBradfordContainer.innerHTML = currentWindBearingBradford;
	
};