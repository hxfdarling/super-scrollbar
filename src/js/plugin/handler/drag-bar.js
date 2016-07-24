/**
 * Created by z-man on 2016/7/21.
 * @class drag-scrollbar
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('../instances');
var update = require('../update');
var updateScroll = require('../update-scroll');
var helper = require('../../lib/helper');
var dom = require('../../lib/dom');
function bindMouseScrollXHandler(element, instance) {
	var currentLeft = null;
	var currentPageX = null;

	function updateScrollLeft(deltaX) {
		instance.setCurrentLeft(currentLeft + (deltaX * instance.railXRatio));
		updateScroll(element, 'left', instance.currentLeft);
	}

	var mouseMoveHandler = function (e) {
		updateScrollLeft(e.pageX - currentPageX);
		e.stopPropagation();
		e.preventDefault();
	};

	var mouseUpHandler = function () {
		instance.stopScrolling('x');
		dom.removeClass(instance.barXRail, 'drag');
		instance.event.off(instance.ownerDocument, 'mousemove', mouseMoveHandler);
	};
	instance.event.on(instance.barX, 'mousedown', function (e) {
		currentPageX = e.pageX;
		currentLeft = instance.barX.offsetLeft * instance.railXRatio;
		instance.startScrolling('x');
		dom.addClass(instance.barXRail, 'drag');
		instance.event.on(instance.ownerDocument, 'mousemove', mouseMoveHandler);
		instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);

		e.stopPropagation();
		e.preventDefault();
	});

}

function bindMouseScrollYHandler(element, instance) {
	var currentTop = null;
	var currentPageY = null;

	function updateScrollTop(deltaY) {
		instance.setCurrentTop(currentTop + (deltaY * instance.railYRatio));
		updateScroll(element, 'top', instance.currentTop);
	}

	var mouseMoveHandler = function (e) {
		updateScrollTop(e.pageY - currentPageY);
		e.stopPropagation();
		e.preventDefault();
	};

	var mouseUpHandler = function () {
		instance.stopScrolling('y');
		dom.removeClass(instance.barYRail, 'drag');
		instance.event.off(instance.ownerDocument, 'mousemove', mouseMoveHandler);
	};

	instance.event.on(instance.barY, 'mousedown', function (e) {
		currentPageY = e.pageY;
		currentTop = instance.barY.offsetTop * instance.railYRatio;
		instance.startScrolling('y');
		dom.addClass(instance.barYRail, 'drag');
		instance.event.on(instance.ownerDocument, 'mousemove', mouseMoveHandler);
		instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);
		e.stopPropagation();
		e.preventDefault();
	});
}

module.exports = function (element) {
	var instance = instances.get(element);
	bindMouseScrollXHandler(element, instance);
	bindMouseScrollYHandler(element, instance);
};