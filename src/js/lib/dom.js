'use strict';
var helper = require('./helper');
var DOM = {};

DOM.element = function(tagName, className) {
	var element = document.createElement(tagName);
	element.className = className;
	return element;
};

DOM.appendTo = function(child, parent) {
	parent.appendChild(child);
	return child;
};

function cssGet(element, styleName) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(element)[styleName];
	}
	if (element.currentStyle) {
		return element.currentStyle[styleName]
	}

}

function cssSet(element, styleName, styleValue) {
	if (typeof styleValue === 'number') {
		styleValue = styleValue.toString() + 'px';
	}
	element.style[styleName] = styleValue;
	return element;
}

function cssMultiSet(element, obj) {
	for (var key in obj) {
		cssSet(element, key, obj[key]);
	}
	return element;
}

DOM.css = function(element, styleNameOrObject, styleValue) {
	if (typeof styleNameOrObject === 'object') {
		// multiple set with object
		return cssMultiSet(element, styleNameOrObject);
	} else {
		if (typeof styleValue === 'undefined') {
			return cssGet(element, styleNameOrObject);
		} else {
			return cssSet(element, styleNameOrObject, isNaN(styleValue) ? 0 : styleValue);
		}
	}
};
DOM.width = function(element, value) {
	return helper.toInt(DOM.css(element, 'width', value));
};
DOM.height = function(element, value) {
	return helper.toInt(DOM.css(element, 'height', value));
};
DOM.matches = function(element, query) {
	if (typeof element.matches !== 'undefined') {
		return element.matches(query);
	} else {
		if (typeof element.matchesSelector !== 'undefined') {
			return element.matchesSelector(query);
		} else if (typeof element.webkitMatchesSelector !== 'undefined') {
			return element.webkitMatchesSelector(query);
		} else if (typeof element.mozMatchesSelector !== 'undefined') {
			return element.mozMatchesSelector(query);
		} else if (typeof element.msMatchesSelector !== 'undefined') {
			return element.msMatchesSelector(query);
		}
	}
};

DOM.remove = function(element) {
	if (typeof element.remove !== 'undefined') {
		element.remove();
	} else {
		if (element.parentNode) {
			element.parentNode.removeChild(element);
		}
	}
};

DOM.queryChildren = function(element, selector) {
	return Array.prototype.filter.call(element.childNodes, function(child) {
		return DOM.matches(child, selector);
	});
};
DOM.createEvent = function(name) {
	var event;
	if (document.createEvent) {
		event = document.createEvent('Event');
		event.initEvent(name, true, true);
	}
	if (document.createEventObject) {
		event = document.createEventObject(name);
		event.type = name;
	}
	return event;
};
DOM.dispatchEvent = function(element, event) {
	if (document.createEventObject) {
		//element.fireEvent('on' + event.type);
	} else if (element.dispatchEvent) {
		element.dispatchEvent(event);
	}
};

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

DOM.addClass = addClass;
DOM.removeClass = removeClass;
DOM.hasClass = hasClass;

window.dom = DOM;
module.exports = DOM;