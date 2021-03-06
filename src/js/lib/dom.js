'use strict';
var helper = require('./helper');
var DOM = {};

DOM.element = function(tagName, className) {
	var element = document.createElement(tagName);
	className && (element.className = className);
	return element;
};

DOM.appendTo = function(child, parent) {
	parent.appendChild(child);
	return child;
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

DOM.wrap = function(element, parent) {
	var cp = element.parentNode;
	parent.appendChild(element);
	cp.appendChild(parent);
};
DOM.unwrap = function(element) {
	var cp = element.parentNode;
	var parent;
	if (cp && cp.parentNode) {
		parent = cp.parentNode;
		parent.appendChild(element);
		DOM.remove(cp);
	}
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
			return cssSet(element, styleNameOrObject, styleValue);
		}
	}
};
DOM.width = function(element, value) {
	if (typeof getComputedStyle !== 'undefined') {
		return helper.toInt(DOM.css(element, 'width', value));
	} else {
		if (value !== undefined) {
			helper.toInt(DOM.css(element, 'width', value));
		}
		if ('content-box' === DOM.css(element, 'boxSizing')) {
			return element.offsetWidth - (helper.toInt(DOM.css(element, 'borderLeftWidth')) + helper.toInt(DOM.css(element, 'borderRightWidth'))) - (helper.toInt(DOM.css(element, 'paddingLeft')) + helper.toInt(DOM.css(element, 'paddingRight')));
		} else {
			return element.offsetWidth
		}

	}
};
DOM.height = function(element, value) {
	if (typeof getComputedStyle !== 'undefined') {
		return helper.toInt(DOM.css(element, 'height', value));
	} else {
		if (value !== undefined) {
			helper.toInt(DOM.css(element, 'height', value));
		}
		if ('content-box' === DOM.css(element, 'boxSizing')) {
			return element.offsetHeight - (helper.toInt(DOM.css(element, 'borderTopWidth')) + helper.toInt(DOM.css(element, 'borderBottomWidth'))) - (helper.toInt(DOM.css(element, 'paddingTop')) + helper.toInt(DOM.css(element, 'paddingBottom')));
		} else {
			return element.offsetHeight;
		}

	}
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
	} else if (document.createEventObject) {
		event = document.createEventObject();
		event.type = name;
	}
	return event;
};
DOM.dispatchEvent = function(element, event) {

	if (element.dispatchEvent) {
		element.dispatchEvent(event);
	} else if (element.fireEvent) {
		//element.fireEvent('on' + event.type, event);
	}
};

DOM.addClass = function(element, className) {

	if (element.classList) {
		element.classList.add(className);
	} else {
		var classes = element.className.split(' ');
		if (classes.indexOf(className) < 0) {
			classes.push(className);
		}
		element.className = classes.join(' ');
	}

};

DOM.removeClass = function(element, className) {
	var clses = className.split(' ');
	if (clses.length > 1) {
		clses.forEach(function(cls) {
			DOM.removeClass(element, cls);
		});
	} else {
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
};
DOM.listClass = function(element) {
	if (element.classList) {
		return Array.prototype.slice.apply(element.classList);
	} else {
		return element.className.split(' ');
	}
};

DOM.hasClass = function(element, className) {
	var cls = DOM.listClass(element);
	return (cls.indexOf(className));
};
module.exports = DOM;