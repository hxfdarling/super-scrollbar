/**
 * Created by z-man on 2016/7/21.
 * @class touch
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
'use strict';

var helper = require('../../lib/helper');
var instances = require('../instances');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, instance, supportsTouch, supportsIePointer) {
	function shouldPreventDefault(deltaX, deltaY) {
		var currentTop = instance.currentTop;
		var currentLeft = instance.currentLeft;
		var magnitudeX = Math.abs(deltaX);
		var magnitudeY = Math.abs(deltaY);

		if (magnitudeY > magnitudeX) {
			// user is perhaps trying to swipe up/down the page

			if (((deltaY < 0) && (currentTop === instance.contentHeight - instance.containerHeight)) ||
				((deltaY > 0) && (currentTop === 0))) {
				return !instance.config.swipePropagation;
			}
		} else if (magnitudeX > magnitudeY) {
			// user is perhaps trying to swipe left/right across the page

			if (((deltaX < 0) && (currentLeft === instance.contentWidth - instance.containerWidth)) ||
				((deltaX > 0) && (currentLeft === 0))) {
				return !instance.config.swipePropagation;
			}
		}

		return true;
	}

	function applyTouchMove(differenceX, differenceY) {
		updateScroll(element, 'top', instance.currentTop - differenceY);
		updateScroll(element, 'left', instance.currentLeft - differenceX);
	}

	var startOffset = {};
	var startTime = 0;
	var speed = {};
	var inGlobalTouch = false;
	var inLocalTouch = false;

	function globalTouchStart() {
		inGlobalTouch = true;
	}

	function globalTouchEnd() {
		inGlobalTouch = false;
	}

	function getTouch(e) {
		if (e.targetTouches) {
			return e.targetTouches[0];
		} else {
			// Maybe IE pointer
			return e;
		}
	}

	function shouldHandle(e) {
		if (e.targetTouches && e.targetTouches.length === 1) {
			return true;
		}
		if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
			return true;
		}
		return false;
	}

	function touchStart(e) {
		e = e.originalEvent;
		$element.addClass('touch');
		if (shouldHandle(e)) {
			inLocalTouch = true;

			var touch = getTouch(e);

			startOffset.pageX = touch.pageX;
			startOffset.pageY = touch.pageY;

			startTime = (new Date()).getTime();
			instance.animate.stop();

			e.stopPropagation();
		}
	}

	function touchMove(e) {
		e = e.originalEvent;
		if (!inLocalTouch && instance.config.swipePropagation) {
			touchStart(e);
		}
		if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
			var touch = getTouch(e);

			var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

			var differenceX = currentOffset.pageX - startOffset.pageX;
			var differenceY = currentOffset.pageY - startOffset.pageY;

			applyTouchMove(differenceX, differenceY);
			startOffset = currentOffset;

			var currentTime = (new Date()).getTime();

			var timeGap = currentTime - startTime;
			if (timeGap > 0) {
				speed.x = differenceX / timeGap;
				speed.y = differenceY / timeGap;
				startTime = currentTime;
			}

			if (shouldPreventDefault(differenceX, differenceY)) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
	}

	function touchEnd() {
		$element.removeClass('touch');
		if (!inGlobalTouch && inLocalTouch) {
			inLocalTouch = false;
			instance.animate.run({
				top: {
					delta: -200 * speed.y
				},
				left: {
					delta: -200 * speed.x
				}
			})
		}
	}

	var $window = $(window);
	var $element = $(element);
	if (supportsTouch) {
		$window.on('touchstart', globalTouchStart);
		$window.on('touchend', globalTouchEnd);

		$element.on('touchstart', touchStart);
		$element.on('touchmove', touchMove);
		$element.on('touchend', touchEnd);
	}

	if (supportsIePointer) {
		if (window.PointerEvent) {
			$window.on('touchstart', 'pointerdown', globalTouchStart);
			$window.on('touchstart', 'pointerup', globalTouchEnd);

			$element.on('pointerdown', touchStart);
			$element.on('pointermove', touchMove);
			$element.on('pointerup', touchEnd);
		} else if (window.MSPointerEvent) {
			$window.on('touchstart', 'MSPointerDown', globalTouchStart);
			$window.on('touchstart', 'MSPointerUp', globalTouchEnd);

			$element.on('MSPointerDown', touchStart);
			$element.on('MSPointerMove', touchMove);
			$element.on('MSPointerUp', touchEnd);
		}
	}
}

module.exports = function (element) {
	if (!helper.env.supportsTouch && !helper.env.supportsIePointer) {
		return;
	}
	bindTouchHandler(element, instances.get(element), helper.env.supportsTouch, helper.env.supportsIePointer);
};
