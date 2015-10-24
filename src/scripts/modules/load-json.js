'use strict';

module.exports = function () {

	var loadJSON = function(file, callback, asynch) {
		var xhr = new XMLHttpRequest();
		xhr.callback = callback;
		if (xhr.overrideMimeType) {
			xhr.overrideMimeType('application/json');
		}
		xhr.ontimeout = function() {
			console.error('The request for ' + file + ' timed out.');
		};
		xhr.open('GET', file, asynch);
		xhr.onload = function() {
			if (this.readyState === 4) {
				var thisResponseText = this.responseText;
				var thisResponseJSON = JSON.parse(thisResponseText);
				console.log('thisResponseJSON', thisResponseJSON);
				this.callback(thisResponseJSON);
			}
		};
		xhr.onerror = function() {
			console.error(xhr.statusText);
		};
		xhr.timeout = 200;
		xhr.send(null);
	};

	return loadJSON;
};