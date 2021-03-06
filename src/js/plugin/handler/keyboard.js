/**
 * Created by z-man on 2016/7/21.
 * @class keyboard
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var update = require('../update');
var helper = require('../../lib/helper');
var updateScroll = require('../update-scroll');
function bindKeyBoard(element) {
	var instance = instances.get(element);
	var key = {
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		spacebar: 32,
		pageup: 33,
		pagedown: 34,
		end: 35,
		home: 36
	};

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

	element.setAttribute('tabIndex', 0);
	instance.event.on(element, 'keydown', function (event) {
		if (helper.isEditable(event.target || event.srcElement)) {
			return;
		}
		var keyScrollIncrement = instance.config.keyScrollIncrement;
		var deltaX = 0,
			deltaY = 0;
		switch (event.keyCode) {
			case key.left:
				deltaX = -keyScrollIncrement;
				break;
			case key.right:
				deltaX = keyScrollIncrement;
				break;
			case key.up:
				deltaY = -keyScrollIncrement;
				break;
			case key.down:
				deltaY = keyScrollIncrement;
				break;
			case key.spacebar:
				deltaY = keyScrollIncrement * 3;
				break;
			case key.pageup:
				deltaY = -keyScrollIncrement * 3;
				break;
			case key.pagedown:
				deltaY = keyScrollIncrement * 3;
				break;
			case key.end:
				deltaY = -instance.currentTop + instance.contentHeight;
				break;
			case key.home:
				deltaY = -instance.currentTop;
				break;
		}
		if (shouldBeConsumedByChild(-deltaX, -deltaY)) {
			return;
		}
		if (instance.config.animate) {
			instance.animate.run({
				top: {
					delta: deltaY
				},
				left: {
					delta: deltaX
				}
			});
		} else {
			deltaY && updateScroll(element, 'top', instance.currentTop + deltaY);
			deltaX && updateScroll(element, 'left', instance.currentLeft + deltaX);
		}
	});
}
module.exports = function (element) {
	bindKeyBoard(element);
};