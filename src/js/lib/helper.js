/**
 * Created by z-man on 2016/7/21.
 * @class helper
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var dom = require('./dom');

function addClass(element, className) {

	if (element.classList) {
		element.classList.add(className);
	} else {
		var classes = element.className.split(' ');
		if (classes.indexOf(className) < 0) {
			classes.push(className);
		}
		element.className = classes.join(' ');
	}

}

function removeClass(element, className) {

	if (element.classList) {
		element.classList.remove(className);
	} else {
		var classes = element.className.split(' ');
		var idx = classes.indexOf(className);
		if (idx >= 0) {
			classes.splice(idx, 1);
		}
		element.className = classes.join(' ');
	}

}

function listClass(element) {
	if (element.classList) {
		return Array.prototype.slice.apply(element.classList);
	} else {
		return element.className.split(' ');
	}
}

function hasClass(element, className) {
	var cls = listClass(element);
	return (cls.indexOf(className));
}

exports.addClass = addClass;
exports.removeClass = removeClass;
exports.hasClass = hasClass;

var toInt = exports.toInt = function(x) {
	return parseInt(x, 10) || 0;
};

var clone = exports.clone = function(obj) {
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



exports.isEditable = function(el) {
	return dom.matches(el, "input,[contenteditable]") ||
		dom.matches(el, "select,[contenteditable]") ||
		dom.matches(el, "textarea,[contenteditable]") ||
		dom.matches(el, "button,[contenteditable]");
};



exports.startScrolling = function(element, axis) {
	addClass(element, 'ss-in-scrolling');
	if (typeof axis !== 'undefined') {
		addClass(element, 'ss-' + axis);
	} else {
		addClass(element, 'ss-x');
		addClass(element, 'ss-y');
	}
};

exports.stopScrolling = function(element, axis) {
	removeClass(element, 'ss-in-scrolling');
	if (typeof axis !== 'undefined') {
		removeClass(element, 'ss-' + axis);
	} else {
		removeClass(element, 'ss-x');
		removeClass(element, 'ss-y');
	}
};

exports.env = {
	isWebKit: 'WebkitAppearance' in document.documentElement.style,
	supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
	supportsIePointer: window.navigator.msMaxTouchPoints !== null
};