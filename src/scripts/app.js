'use strict';

var interfaceInit = require('./modules/interface');
var CoordsForm = require('./modules/coords-form');
//start app
interfaceInit();

var coordsFormEl = document.getElementById('form-coords');
if (coordsFormEl.length > 0) {
	var coordsForm = new CoordsForm(coordsFormEl);
	coordsForm.init();
}