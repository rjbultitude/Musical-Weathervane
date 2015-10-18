'use strict';

var getLocations = require('./modules/get-locations');
var interfaceInit = require('./modules/interface');
//start app
var locations = getLocations();
var interfaceLoaded = interfaceInit();