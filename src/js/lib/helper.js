/**
 * Created by z-man on 2016/7/21.
 * @class helper
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

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
module.exports = {
	addClass: addClass,
	removeClass: removeClass,
	hasClass: hasClass
};