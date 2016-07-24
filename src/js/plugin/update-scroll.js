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

var upEvent = dom.createEvent('ss-scroll-up');
var downEvent = dom.createEvent('ss-scroll-down');
var leftEvent = dom.createEvent('ss-scroll-left');
var rightEvent = dom.createEvent('ss-scroll-right');
var yEvent = dom.createEvent('ss-scroll-y');
var xEvent = dom.createEvent('ss-scroll-x');
var xStartEvent = dom.createEvent('ss-x-reach-start');
var xEndEvent = dom.createEvent('ss-x-reach-end');
var yStartEvent = dom.createEvent('ss-y-reach-start');
var yEndEvent = dom.createEvent('ss-y-reach-end');

var lastTop;
var lastLeft;
module.exports = function (element, axis, value) {
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
		element.scrollTop = value = 0; // don't allow negative scroll
		dom.dispatchEvent(element, yStartEvent);
	}

	if (axis === 'left' && value <= 0) {
		element.scrollLeft = value = 0; // don't allow negative scroll
		dom.dispatchEvent(element, xStartEvent);
	}

	var instance = instances.get(element);

	if (axis === 'top' && value >= instance.maxTop) {
		// don't allow scroll past container
		value = instance.maxTop;
		if (value - element.scrollTop <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			// fix edge buge
			//value = element.scrollTop;
		} else {
			element.scrollTop = value;
		}
		dom.dispatchEvent(element, yEndEvent);
	}

	if (axis === 'left' && value >= instance.maxLeft) {
		// don't allow scroll past container
		value = instance.maxLeft;
		if (value - element.scrollLeft <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			//fix edge buge
			//value = element.scrollLeft;
		} else {
			dom.scrollLeft = value;
		}
		dom.dispatchEvent(element, xEndEvent);
	}

	if (!lastTop) {
		lastTop = element.scrollTop;
	}

	if (!lastLeft) {
		lastLeft = element.scrollLeft;
	}

	if (axis === 'top' && value < lastTop) {
		dom.dispatchEvent(element, upEvent);
	}

	if (axis === 'top' && value > lastTop) {
		dom.dispatchEvent(element, downEvent);
	}

	if (axis === 'left' && value < lastLeft) {
		dom.dispatchEvent(element, leftEvent);
	}

	if (axis === 'left' && value > lastLeft) {
		dom.dispatchEvent(element, rightEvent);
	}
	if (axis === 'top') {
		element.scrollTop = lastTop = instance.currentTop = value;
		dom.dispatchEvent(element, yEvent);
	}

	if (axis === 'left') {
		element.scrollLeft = lastLeft = instance.currentLeft = value;
		dom.dispatchEvent(element, xEvent);
	}
	updateBar(element);
};