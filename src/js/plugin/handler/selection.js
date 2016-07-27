/**
 * Created by z-man on 2016/7/21.
 * @class selection
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var helper = require('../../lib/helper');
var instances = require('../instances');
var dom = require('../../lib/dom');
var updateScroll = require('../update-scroll');
function bindSelectionHandler(element, instance) {
	if (dom.css(element, 'overflow') === 'auto') {//本地滚动的selection修复
		return;
	}

	function getRangeNode() {
		var selection = window.getSelection ? window.getSelection() :
			document.getSelection ? document.getSelection() : '';
		if (selection.toString().length === 0) {
			return null;
		} else {
			return selection.getRangeAt(0).commonAncestorContainer;
		}
	}

	var scrollingLoop = null;
	var scrollDiff = {top: 0, left: 0};

	function startScrolling() {
		if (!scrollingLoop) {
			scrollingLoop = setInterval(function () {
				if (!instances.get(element)) {
					clearInterval(scrollingLoop);
					return;
				}
				if (instance.config.animate) {
					instance.animate.run({
						top: {delta: scrollDiff.top},
						left: {delta: scrollDiff.left}
					});
				} else {
					scrollDiff.top && updateScroll(element, 'top', instance.currentTop + scrollDiff.top);
					scrollDiff.left && updateScroll(element, 'left', instance.currentLeft + scrollDiff.left);
				}
			}, 50); // every .1 sec
		}
	}

	function stopScrolling() {
		if (scrollingLoop) {
			clearInterval(scrollingLoop);
			scrollingLoop = null;
		}
		instance.stopScrolling();
	}

	var isSelected = false;
	var mousedown = false;
	instance.event.on(instance.ownerDocument, 'selectionchange', function () {
		if (element.contains(getRangeNode())) {
			isSelected = true;
		} else {
			isSelected = false;
			stopScrolling();
		}
	});
	if (typeof instance.ownerDocument.onselectionchange === 'undefined') {
		instance.event.on(element, 'mousedown', function () {//fix firefox no onselectionchange
			mousedown = true;
		});
	}

	instance.event.on(window, 'mouseup', function () {
		mousedown = false;
		if (isSelected) {
			isSelected = false;
			stopScrolling();
		}
		dom.removeClass(instance.wrapElement, 'selection');
	});
	instance.event.on(window, 'blur', function () {
		mousedown = false;
		if (isSelected) {
			isSelected = false;
			stopScrolling();
		}
		dom.removeClass(element, 'selection');
	});

	instance.event.on(window, 'mousemove', function (e) {
		if (!isSelected && mousedown) {
			if (element.contains(getRangeNode())) {
				isSelected = true;
			}
		}
		if (isSelected) {
			var mousePosition = {x: e.pageX, y: e.pageY};
			var containerGeometry = {
				left: element.offsetLeft,
				right: element.offsetLeft + element.offsetWidth,
				top: element.offsetTop,
				bottom: element.offsetTop + element.offsetHeight
			};
			if (mousePosition.x < containerGeometry.left + 3) {
				scrollDiff.left = -5;
				instance.startScrolling('x');
			} else if (mousePosition.x > containerGeometry.right - 3) {
				scrollDiff.left = 5;
				instance.startScrolling('x');
			} else {
				scrollDiff.left = 0;
			}

			if (mousePosition.y < containerGeometry.top + 3) {
				if (containerGeometry.top + 3 - mousePosition.y < 20) {
					scrollDiff.top = -5;
				} else {
					scrollDiff.top = -20;
				}
				instance.startScrolling('y');
			} else if (mousePosition.y > containerGeometry.bottom - 3) {
				if (mousePosition.y - containerGeometry.bottom + 3 < 20) {
					scrollDiff.top = 5;
				} else {
					scrollDiff.top = 20;
				}
				instance.startScrolling('y');
			} else {
				scrollDiff.top = 0;
			}
			if (scrollDiff.top === 0 && scrollDiff.left === 0) {
				stopScrolling();
			} else {
				startScrolling();
			}
		}
	});
}

module.exports = function (element) {
	var i = instances.get(element);
	bindSelectionHandler(element, i);
};
