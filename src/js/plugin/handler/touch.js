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
var dom = require('../../lib/dom');

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
	var momentun = {
		_doing: false,
		duration: 300,
		start: function(speed) {
			this.lastPosition = [0, 0];
			this.startTime = new Date().getTime();
			var frame = {
				speed: speed
			};
			frame.accelerate = {
				x: -speed.x / this.duration,
				y: -speed.y / this.duration
			};
			this._frame = frame;
			this._doing = true;
			helper.requestAnimationFrameHelper.call(window, this.step.bind(this));
		},
		getPosition: function(t) {
			var speed = this._frame.speed;
			var accelerate = this._frame.accelerate;
			var p = [
				(Math.pow(speed.x, 2) - Math.pow(speed.x - t * accelerate.x, 2)) / (2 * accelerate.x),
				(Math.pow(speed.y, 2) - Math.pow(speed.y - t * accelerate.y, 2)) / (2 * accelerate.y)
			]
			return p;
		},
		step: function() {
			if (!this._doing) {
				return;
			}
			var now = new Date().getTime();
			var elapsed = now - this.startTime;
			var finish = elapsed >= this.duration;
			var position = this.getPosition(finish ? this.duration : elapsed);
			var lp = this.lastPosition;
			updateScroll(element, 'left', instance.currentLeft + position[0] - lp[0]);
			updateScroll(element, 'top', instance.currentTop + position[1] - lp[1]);
			this.lastPosition = position;
			if (finish) {
				this._doing = false;
			} else {
				helper.requestAnimationFrameHelper.call(window, this.step.bind(this));
			}
		},
		end: function() {
			this._doing = false;
		}
	}

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
		momentun.end();
		dom.addClass(element, 'touch');
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
		if (!inLocalTouch && instance.config.swipePropagation) {
			//touchStart(e);
		}
		if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
			var touch = getTouch(e);

			var currentOffset = {
				pageX: touch.pageX,
				pageY: touch.pageY
			};

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
		dom.removeClass(element, 'touch');
		if (!inGlobalTouch && inLocalTouch) {
			inLocalTouch = false;
			momentun.start({
				x: -speed.x,
				y: -speed.y
			});

		}
	}

	if (supportsTouch) {
		instance.event.on(window, 'touchstart', globalTouchStart);
		instance.event.on(window, 'touchend', globalTouchEnd);

		instance.event.on(element, 'touchstart', touchStart);
		instance.event.on(element, 'touchmove', touchMove);
		instance.event.on(element, 'touchend', touchEnd);
	}

	if (supportsIePointer) {
		if (window.PointerEvent) {
			instance.event.on(window, 'touchstart', 'pointerdown', globalTouchStart);
			instance.event.on(window, 'touchstart', 'pointerup', globalTouchEnd);

			instance.event.on(element, 'pointerdown', touchStart);
			instance.event.on(element, 'pointermove', touchMove);
			instance.event.on(element, 'pointerup', touchEnd);
		} else if (window.MSPointerEvent) {
			instance.event.on(window, 'touchstart', 'MSPointerDown', globalTouchStart);
			instance.event.on(window, 'touchstart', 'MSPointerUp', globalTouchEnd);

			instance.event.on(element, 'MSPointerDown', touchStart);
			instance.event.on(element, 'MSPointerMove', touchMove);
			instance.event.on(element, 'MSPointerUp', touchEnd);
		}
	}
}

module.exports = function(element) {
	if (!helper.env.supportsTouch && !helper.env.supportsIePointer) {
		return;
	}
	bindTouchHandler(element, instances.get(element), helper.env.supportsTouch, helper.env.supportsIePointer);
};