/**
 * Created by z-man on 2016/7/21.
 * @class helper
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var dom = require('./dom');
var toInt = exports.toInt = function (x) {
	return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
	if (obj === null) {
		return null;
	} else if (obj.constructor === Array) {
		return obj.map(clone);
	} else if (typeof obj === 'object') {
		var result = {};
		for (var key in obj) {
			result[key] = clone(obj[key]);
		}
		return result;
	} else {
		return obj;
	}
};

var apply = function (dest, src, defaults) {
	if (defaults) {
		apply(dest, defaults);
	}

	if (dest && src && typeof src == 'object') {
		for (var key in src) {
			dest[key] = src[key];
		}
	}
	return dest;
};
exports.apply = apply;

/*
 * Wraps window properties to allow server side rendering
 */
var currentWindowProperties = function () {
	if (typeof window !== 'undefined') {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	}
};

/*
 * Helper function to never extend 60fps on the webpage.
 */
exports.requestAnimationFrameHelper = (function () {
	return currentWindowProperties() ||
		function (callback, element, delay) {
			return window.setTimeout(callback, delay || (1000 / 60), Date.now());
		};
})();

exports.isEditable = function (el) {
	return dom.matches(el, "input,[contenteditable]") ||
		dom.matches(el, "select,[contenteditable]") ||
		dom.matches(el, "textarea,[contenteditable]") ||
		dom.matches(el, "button,[contenteditable]");
};
exports.preventDefault = function (e) {
	//阻止默认浏览器动作(W3C)
	if (e && e.preventDefault) {
		e.preventDefault();
	} else {//IE中阻止函数器默认动作的方式
		window.event.returnValue = false;
	}
	return false;
};
exports.stopPropagation = function (e) {
//如果提供了事件对象，则这是一个非IE浏览器
	if (e && e.stopPropagation) {
		//因此它支持W3C的stopPropagation()方法
		e.stopPropagation();
	} else {
		//否则，我们需要使用IE的方式来取消事件冒泡
		window.event.cancelBubble = true;
	}
};
exports.getPageX = function (e) {
	return typeof e.pageX === 'undefined' ? e.clientX : e.pageX;
};
exports.getPageY = function (e) {
	return typeof e.pageY === 'undefined' ? e.clientY : e.pageY;
};
exports.env = {
	isEdge: /Edge/.test(navigator.userAgent),
	isWebKit: 'WebkitAppearance' in document.documentElement.style,
	supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
	supportsIePointer: window.navigator.msMaxTouchPoints !== null
};