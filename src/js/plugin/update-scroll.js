/**
 * Created by z-man on 2016/7/21.
 * @class update-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('./instances');
var updateBar = require('./update-bar');
var dom = require('../lib/dom');

var yEvent = dom.createEvent('ss-scroll-y');
var xEvent = dom.createEvent('ss-scroll-x');

var lastTop;
var lastLeft;
module.exports = function(element, axis, value) {
	if (typeof element === 'undefined') {
		throw 'You must provide an element to the update-scroll function';
	}

	if (typeof axis === 'undefined') {
		throw 'You must provide an axis to the update-scroll function';
	}

	if (typeof value === 'undefined') {
		throw 'You must provide a value to the update-scroll function';
	}

	if (axis === 'top' && value <= 0) {
		value = 0; // don't allow negative scroll
	}

	if (axis === 'left' && value <= 0) {
		value = 0; // don't allow negative scroll
	}

	var instance = instances.get(element);

	if (axis === 'top' && value >= instance.maxTop) {
		// don't allow scroll past container
		value = instance.maxTop;
		if (value - element.scrollTop <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			// fix edge buge
			//value = element.scrollTop;
		}
	}

	if (axis === 'left' && value >= instance.maxLeft) {
		// don't allow scroll past container
		value = instance.maxLeft;
		if (value - element.scrollLeft <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			//fix edge buge
			//value = element.scrollLeft;
		}
	}

	if (!lastTop) {
		lastTop = element.scrollTop;
	}

	if (!lastLeft) {
		lastLeft = element.scrollLeft;
	}
	if (axis === 'top') {
		instance.currentTop = lastTop = value;
		updateBar(element);
		element.scrollTop = instance.currentTop;
		dom.dispatchEvent(element, yEvent);
	}

	if (axis === 'left') {
		instance.currentLeft = lastLeft = value;
		updateBar(element);
		element.scrollLeft = instance.currentLeft;
		dom.dispatchEvent(element, xEvent);
	}

};