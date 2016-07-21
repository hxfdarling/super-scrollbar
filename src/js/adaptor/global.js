'use strict';

var ss = require('../main');

if (typeof define === 'function' && define.amd) {
	// AMD
	define(ss);
} else {
	// Add to a global object.
	window.superScroll = ss;
	if (typeof window.Ss === 'undefined') {
		window.Ss = ss;
	}
}