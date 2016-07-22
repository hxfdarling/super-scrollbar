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
var $ = require('../../lib/dom');
function bindMouseScrollXHandler(element, instance) {
	var currentLeft = null;
	var currentPageX = null;
	var $doc = $(instance.ownerDocument);

	function updateScrollLeft(deltaX) {
		var newLeft = currentLeft + (deltaX * instance.railXRatio);
		var maxLeft = instance.maxLeft;
		if (newLeft < 0) {
			instance.currentLeft = 0;
		} else if (newLeft > maxLeft) {
			instance.currentLeft = maxLeft;
		} else {
			instance.currentLeft = newLeft;
		}
		updateScroll(element, 'left', instance.currentLeft);
	}

	var mouseMoveHandler = function (e) {
		updateScrollLeft(e.pageX - currentPageX);
		update(element);
		e.stopPropagation();
		e.preventDefault();
	};

	var mouseUpHandler = function () {
		helper.stopScrolling(element, 'x');
		$doc.off('mousemove', mouseMoveHandler);
	};
	var $barX = $(instance.barX);
	$barX.on('mousedown', function (e) {
		currentPageX = e.pageX;
		currentLeft = $barX.position().left * instance.railXRatio;
		helper.startScrolling(element, 'x');
		$doc.on('mousemove', mouseMoveHandler);
		$doc.one('mouseup', mouseUpHandler);

		e.stopPropagation();
		e.preventDefault();
	});

}

function bindMouseScrollYHandler(element, instance) {
	var currentTop = null;
	var currentPageY = null;
	var $doc = $(instance.ownerDocument);

	function updateScrollTop(deltaY) {
		var newTop = currentTop + (deltaY * instance.railYRatio);
		var maxTop = instance.maxTop;

		if (newTop < 0) {
			instance.currentTop = 0;
		} else if (newTop > maxTop) {
			instance.currentTop = maxTop;
		} else {
			instance.currentTop = newTop;
		}
		updateScroll(element, 'top', instance.currentTop);
	}

	var mouseMoveHandler = function (e) {
		updateScrollTop(e.pageY - currentPageY);
		update(element);
		e.stopPropagation();
		e.preventDefault();
	};

	var mouseUpHandler = function () {
		helper.stopScrolling(element, 'y');
		$doc.off('mousemove', mouseMoveHandler);
	};

	var $barY = $(instance.barY);

	$barY.on('mousedown', function (e) {
		currentPageY = e.pageY;
		currentTop = $barY.position().top * instance.railYRatio;
		helper.startScrolling(element, 'y');
		$doc.on('mousemove', mouseMoveHandler);
		$doc.one('mouseup', mouseUpHandler);
		e.stopPropagation();
		e.preventDefault();
	});
}

module.exports = function (element) {
	var instance = instances.get(element);
	bindMouseScrollXHandler(element, instance);
	bindMouseScrollYHandler(element, instance);
};