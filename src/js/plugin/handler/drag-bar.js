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
var $ = require('../../lib/jquery-bridge');
function bindMouseScrollXHandler(element, instance) {
	var currentLeft = null;
	var currentPageX = null;
	var $doc = $(instance.ownerDocument);

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
		instance.barXRail.removeClass('drag');
		$doc.off('mousemove', mouseMoveHandler);
	};
	var $barX = instance.barX;
	$barX.on('mousedown', function (e) {
		currentPageX = e.pageX;
		currentLeft = $barX.position().left * instance.railXRatio;
		instance.startScrolling('x');
		instance.barXRail.addClass('drag');
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
		instance.barYRail.removeClass('drag');
		$doc.off('mousemove', mouseMoveHandler);
	};

	var $barY = instance.barY;

	$barY.on('mousedown', function (e) {
		currentPageY = e.pageY;
		currentTop = $barY.position().top * instance.railYRatio;
		instance.startScrolling('y');
		instance.barYRail.addClass('drag');
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