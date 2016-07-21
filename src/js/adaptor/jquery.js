'use strict';

var initialize = require('../plugin/initialize');
var update = require('../plugin/update');
var destroy = require('../plugin/destroy');
var instances = require('../plugin/instances');

function mountJQuery(jQuery) {
	jQuery.fn.superScrollbar = function (config) {
		return this.each(function () {
			if (typeof config === 'object' ||
				typeof config === 'undefined') {
				if (!instances.get(this)) {
					initialize(this, config);
				} else {
					update(this);
				}
			} else {
				var command = config;
				if (command === 'update') {
					update(this);
				} else if (command === 'destroy') {
					destroy(this);
				}
			}
		});
	};
}

if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['jquery'], mountJQuery);
} else {
	var jq = window.jQuery || window.$;
	if (typeof jq !== 'undefined') {
		mountJQuery(jq);
	}
}

module.exports = mountJQuery;
