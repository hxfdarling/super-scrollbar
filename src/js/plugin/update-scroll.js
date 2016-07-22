/**
 * Created by z-man on 2016/7/21.
 * @class update-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('./instances');
var upEvent = document.createEvent('Event');
var downEvent = document.createEvent('Event');
var leftEvent = document.createEvent('Event');
var rightEvent = document.createEvent('Event');
var yEvent = document.createEvent('Event');
var xEvent = document.createEvent('Event');
var xStartEvent = document.createEvent('Event');
var xEndEvent = document.createEvent('Event');
var yStartEvent = document.createEvent('Event');
var yEndEvent = document.createEvent('Event');
var lastTop;
var lastLeft;

upEvent.initEvent('ss-scroll-up', true, true);
downEvent.initEvent('ss-scroll-down', true, true);

leftEvent.initEvent('ss-scroll-left', true, true);
rightEvent.initEvent('ss-scroll-right', true, true);

yEvent.initEvent('ss-scroll-y', true, true);
xEvent.initEvent('ss-scroll-x', true, true);

xStartEvent.initEvent('ss-x-reach-start', true, true);
xEndEvent.initEvent('ss-x-reach-end', true, true);

yStartEvent.initEvent('ss-y-reach-start', true, true);
yEndEvent.initEvent('ss-y-reach-end', true, true);

module.exports = function (element, axis, value, animate) {
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
		element.dispatchEvent(yStartEvent);
	}

	if (axis === 'left' && value <= 0) {
		element.scrollLeft = value = 0; // don't allow negative scroll
		element.dispatchEvent(xStartEvent);
	}

	var instance = instances.get(element);

	if (axis === 'top' && value >= instance.contentHeight - instance.containerHeight) {
		// don't allow scroll past container
		value = instance.contentHeight - instance.containerHeight;
		if (value - element.scrollTop <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			value = element.scrollTop;
		} else {
			element.scrollTop = value;
		}
		element.dispatchEvent(yEndEvent);
	}

	if (axis === 'left' && value >= instance.contentWidth - instance.containerWidth) {
		// don't allow scroll past container
		value = instance.contentWidth - instance.containerWidth;
		if (value - element.scrollLeft <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			value = element.scrollLeft;
		} else {
			element.scrollLeft = value;
		}
		element.dispatchEvent(xEndEvent);
	}

	if (!lastTop) {
		lastTop = element.scrollTop;
	}

	if (!lastLeft) {
		lastLeft = element.scrollLeft;
	}

	if (axis === 'top' && value < lastTop) {
		element.dispatchEvent(upEvent);
	}

	if (axis === 'top' && value > lastTop) {
		element.dispatchEvent(downEvent);
	}

	if (axis === 'left' && value < lastLeft) {
		element.dispatchEvent(leftEvent);
	}

	if (axis === 'left' && value > lastLeft) {
		element.dispatchEvent(rightEvent);
	}
	if (axis === 'top') {
		element.scrollTop = lastTop = value;
		instance.barY.css('top', value / instance.railYRatio);
		instance.barYRail.css('top',value );

		instance.barXRail.css('bottom',-value);

		element.dispatchEvent(yEvent);
	}

	if (axis === 'left') {
		element.scrollLeft = lastLeft = value;
		instance.barX.css('left', value / instance.railXRatio);
		instance.barXRail.css('left',value);

		instance.barYRail.css('right',-value);

		element.dispatchEvent(xEvent);
	}
};