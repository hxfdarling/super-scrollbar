/**
 * Created by z-man on 2016/7/21.
 * @class mouse-wheel
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var update = require('../update');
var helper = require('../../lib/helper');

function bindMouseWheelHandler(element, instance) {
	var shouldPrevent = false;

	function shouldPreventDefault(deltaX, deltaY) {
		var scrollTop = element.scrollTop;
		if (deltaX === 0) {
			if (!instance.barYActive) {
				return false;
			}
			if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= instance.maxTop && deltaY < 0)) {
				return !instance.config.wheelPropagation;
			}
		}

		var scrollLeft = element.scrollLeft;
		if (deltaY === 0) {
			if (!instance.barXActive) {
				return false;
			}
			if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= instance.maxLeft && deltaX > 0)) {
				return !instance.config.wheelPropagation;
			}
		}
		return true;
	}

	function getDeltaFromEvent(e) {
		var deltaX = e.deltaX;
		var deltaY = -1 * e.deltaY;
		if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
			// OS X Safari
			deltaX = -1 * e.wheelDeltaX / 6;
			deltaY = e.wheelDeltaY / 6;
		}

		if (e.deltaMode && e.deltaMode === 1) {
			// Firefox in deltaMode 1 means 3 Line scrolling
			deltaX *= 100 / 3;
			deltaY *= 100 / 3;
		}

		if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
			// IE in some mouse drivers
			deltaX = 0;
			deltaY = e.wheelDelta;
		}
		if (helper.env.isEdge) {
			deltaX *= 100 / 130;
			deltaY *= 100 / 130;
		}
		return [-deltaX, deltaY];
	}

	function shouldBeConsumedByChild(deltaX, deltaY) {
		var child = element.querySelector('textarea:hover, select[multiple]:hover, .super-scrollbar:hover');
		if (child) {
			if (child.tagName !== 'TEXTAREA' && !window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
				return false;
			}

			var maxScrollTop = child.scrollHeight - child.clientHeight;
			if (maxScrollTop > 0) {
				if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
					return true;
				}
			}
			var maxScrollLeft = child.scrollLeft - child.clientWidth;
			if (maxScrollLeft > 0) {
				if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
					return true;
				}
			}
		}
		return false;
	}

	function mousewheelHandler(e) {
		var delta = getDeltaFromEvent(e.originalEvent || e);

		var deltaX = delta[0];
		var deltaY = delta[1];
		var newTop, newLeft, perporty = {};
		if (shouldBeConsumedByChild(deltaX, deltaY)) {
			return;
		}
		shouldPrevent = false;
		if (instance.barYActive && instance.barXActive) {
			perporty.top = {delta: -(deltaY * instance.config.wheelSpeed)};
			perporty.left = {delta: -(deltaX * instance.config.wheelSpeed)};
		} else if (instance.barYActive && !instance.barXActive) {
			if (deltaY) {
				newTop = (deltaY * instance.config.wheelSpeed)
			} else {
				newTop = (deltaX * instance.config.wheelSpeed);
			}
			perporty.top = {delta: newTop};
		} else if (instance.barXActive && !instance.barYActive) {
			if (deltaX) {
				newLeft = -(deltaX * instance.config.wheelSpeed);
			} else {
				newLeft = -(deltaY * instance.config.wheelSpeed);
			}
			perporty.left = {delta: newLeft};
		}
		instance.animate.run(perporty);

		if (shouldPreventDefault(deltaX, deltaY)) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	if (typeof window.onwheel !== "undefined") {
		instance.event.on(element, 'wheel', mousewheelHandler);
	} else if (typeof window.onmousewheel !== "undefined") {
		instance.event.on(element, 'mousewheel', mousewheelHandler);
	}
}

module.exports = function (element) {
	var instance = instances.get(element);
	bindMouseWheelHandler(element, instance);
};
