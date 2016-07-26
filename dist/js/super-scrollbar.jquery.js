/* super-scrollbar v1.0.0/
*自定义滚动组件，支持chrome,edge,safari,fireFox,ie8及以上浏览器,拥有完善的事件支持：支持触控、触控板、鼠标滚轮、键盘滚动 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var initialize = require('../plugin/initialize');
var update = require('../plugin/update');
var destroy = require('../plugin/destroy');
var instances = require('../plugin/instances');

function mountJQuery(jQuery) {
	jQuery.fn.superScrollbar = function (config) {
		return this.each(function () {
			if (typeof config === 'object' ||
				typeof config === 'undefined') {
				if (!instances.get(this)) {
					initialize(this, config);
				} else {
					update(this);
				}
			} else {
				var command = config;
				if (command === 'update') {
					update(this);
				} else if (command === 'destroy') {
					destroy(this);
				}
			}
		});
	};
}

if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['jquery'], mountJQuery);
} else {
	var jq = window.jQuery || window.$;
	if (typeof jq !== 'undefined') {
		mountJQuery(jq);
	}
}

module.exports = mountJQuery;

},{"../plugin/destroy":9,"../plugin/initialize":17,"../plugin/instances":18,"../plugin/update":21}],2:[function(require,module,exports){
'use strict';
var helper = require('./helper');
var DOM = {};

DOM.element = function (tagName, className) {
	var element = document.createElement(tagName);
	element.className = className;
	return element;
};

DOM.appendTo = function (child, parent) {
	parent.appendChild(child);
	return child;
};

DOM.remove = function (element) {
	if (typeof element.remove !== 'undefined') {
		element.remove();
	} else {
		if (element.parentNode) {
			element.parentNode.removeChild(element);
		}
	}
};

DOM.wrap = function (element, parent) {
	var cp = element.parentNode;
	parent.appendChild(element);
	cp.appendChild(parent);
};
DOM.unwrap = function (element) {
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

DOM.css = function (element, styleNameOrObject, styleValue) {
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
DOM.width = function (element, value) {
	if (typeof getComputedStyle !== 'undefined') {
		return helper.toInt(DOM.css(element, 'width', value));
	} else {
		if (value !== undefined) {
			helper.toInt(DOM.css(element, 'width', value));
		}
		if ('content-box' === DOM.css(element, 'boxSizing')) {
			return element.offsetWidth
				- (helper.toInt(DOM.css(element, 'borderLeftWidth')) + helper.toInt(DOM.css(element, 'borderRightWidth')))
				- (helper.toInt(DOM.css(element, 'paddingLeft')) + helper.toInt(DOM.css(element, 'paddingRight')));
		} else {
			return element.offsetWidth
		}

	}
};
DOM.height = function (element, value) {
	if (typeof getComputedStyle !== 'undefined') {
		return helper.toInt(DOM.css(element, 'height', value));
	} else {
		if (value !== undefined) {
			helper.toInt(DOM.css(element, 'height', value));
		}
		if ('content-box' === DOM.css(element, 'boxSizing')) {
			return element.offsetHeight
				- (helper.toInt(DOM.css(element, 'borderTopWidth')) + helper.toInt(DOM.css(element, 'borderBottomWidth')))
				- (helper.toInt(DOM.css(element, 'paddingTop')) + helper.toInt(DOM.css(element, 'paddingBottom')));
		} else {
			return element.offsetHeight;
		}

	}
};
DOM.matches = function (element, query) {
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

DOM.queryChildren = function (element, selector) {
	return Array.prototype.filter.call(element.childNodes, function (child) {
		return DOM.matches(child, selector);
	});
};
DOM.createEvent = function (name) {
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
DOM.dispatchEvent = function (element, event) {
	if (document.createEventObject) {
		//element.fireEvent('on' + event.type);
	} else if (element.dispatchEvent) {
		element.dispatchEvent(event);
	}
};

DOM.addClass = function (element, className) {

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

DOM.removeClass = function (element, className) {
	var clses = className.split(' ');
	if (clses.length > 1) {
		clses.forEach(function (cls) {
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
DOM.listClass = function (element) {
	if (element.classList) {
		return Array.prototype.slice.apply(element.classList);
	} else {
		return element.className.split(' ');
	}
};

DOM.hasClass = function (element, className) {
	var cls = DOM.listClass(element);
	return (cls.indexOf(className));
};


module.exports = DOM;
},{"./helper":6}],3:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
	this.element = element;
	this.events = {};
};

EventElement.prototype.on = function (eventName, handler) {
	if (typeof this.events[eventName] === 'undefined') {
		this.events[eventName] = [];
	}
	this.events[eventName].push(handler);
	if (this.element.addEventListener) {
		this.element.addEventListener(eventName, handler, false);
	} else if (this.element.attachEvent) {
		this.element.attachEvent('on' + eventName, handler);
	}

};

EventElement.prototype.off = function (eventName, handler) {
	var isHandlerProvided = (typeof handler !== 'undefined');
	var element = this.element;
	this.events[eventName] = this.events[eventName].filter(function (hdlr) {
		if (isHandlerProvided && hdlr !== handler) {
			return true;
		}
		if (element.removeEventListener) {
			element.removeEventListener(eventName, hdlr, false);
		} else if (element.detachEvent) {
			element.detachEvent('on'+eventName, hdlr);
		}
		return false;
	}, this);
};

EventElement.prototype.offAll = function () {
	for (var name in this.events) {
		this.off(name);
	}
};

var EventManager = function () {
	this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
	var ee = this.eventElements.filter(function (eventElement) {
		return eventElement.element === element;
	})[0];
	if (typeof ee === 'undefined') {
		ee = new EventElement(element);
		this.eventElements.push(ee);
	}
	return ee;
};

EventManager.prototype.on = function (element, eventName, handler) {
	this.eventElement(element).on(eventName, handler);
};
EventManager.prototype.off = function (element, eventName, handler) {
	this.eventElement(element).off(eventName, handler);
};
EventManager.prototype.offAll = function () {
	for (var i = 0; i < this.eventElements.length; i++) {
		this.eventElements[i].offAll();
	}
};
EventManager.prototype.once = function (element, eventName, handler) {
	var ee = this.eventElement(element);
	var onceHandler = function (e) {
		ee.off(eventName, onceHandler);
		handler(e);
	};
	ee.on(eventName, onceHandler);
};

module.exports = EventManager;

},{}],4:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class fixed
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function (scope) {
		var fn = this;
		return function () {
			fn.apply(scope, arguments);
		}
	};
}
if (!String.prototype.format) {
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function (m, i) {
			return args[i];
		});
	};
}
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (value) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === value) {
				return i;
			}
		}
		return -1;
	}
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function (fn) {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			if (fn(this[i])) {
				result.push(this[i]);
			}
		}
		return result;
	}
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (fn) {
		for (var i = 0; i < this.length; i++) {
			fn(this[i]);
		}
	}
}
},{}],5:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],6:[function(require,module,exports){
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
},{"./dom":2}],7:[function(require,module,exports){
/**
 * @author zman
 * @date 2016-4-25
 */
(function (global, undefined) {
	'use strict';
	/*
	 * https://github.com/oblador/angular-scroll (duScrollDefaultEasing)
	 * 0-1
	 */
	var timing = {
		quadratic: function (k) {
			return k * ( 2 - k );
		},
		circular: function (k) {
			return Math.sqrt(1 - ( --k * k ));
		},
		back: function (k) {
			var b = 4;
			return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
		},
		bounce: function (k) {
			if (( k /= 1 ) < ( 1 / 2.75 )) {
				return 7.5625 * k * k;
			} else if (k < ( 2 / 2.75 )) {
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
			} else if (k < ( 2.5 / 2.75 )) {
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
			} else {
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
			}
		},
		elastic: function (k) {
			var f = 0.22,
				e = 0.4;

			if (k === 0) {
				return 0;
			}
			if (k == 1) {
				return 1;
			}
			return ( e * Math.pow(2, -10 * k) * Math.sin(( k - f / 4 ) * ( 2 * Math.PI ) / f) + 1 );

		},
		easing: function (x) {
			if (x < 0.5) {
				return Math.pow(x * 2, 2) / 2;
			}
			return 1 - Math.pow((1 - x) * 2, 2) / 2;
		},
		smooth: function (x) {
			return x;
		}
	};

	var bind = function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		}
	};
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
	var requestAnimationFrameHelper = (function () {
		return currentWindowProperties() ||
			function (callback, element, delay) {
				return window.setTimeout(callback, delay || (1000 / 60), Date.now());
			};
	})();
	var helper = require('./helper');

	/**
	 *
	 * @param config:[property:[key,value],  duration, timing]
	 * @constructor
	 */
	function ZAnimate(config) {
		helper.apply(this, config);
	}

	ZAnimate.prototype = {
		duration: 200,
		/**
		 * quadratic,bounce,easing,back,circular,elastic,smooth
		 */
		timing: 'easing',
		__stoped: false,
		__doing: false,
		__frames: {}
	};
	helper.apply(ZAnimate.prototype, {
		_stepEnd: function () {
			this.__doing = false;
			this.__frames = {};
			this.trigger('zAnimateEnd');
		},
		_pushFrame: function (property) {
			if (!property)return;
			var now = Date.now(), value;
			for (var key in property) {
				if (!property.hasOwnProperty(key)) {
					return;
				}
				if (!this.__frames[key]) {
					this.__frames[key] = [];
				}
				value = property[key];
				if (value.from === undefined) {
					value.from = 0;
				}
				if (value.to === undefined) {
					value.to = 0;
				}
				if (!value.delta) {
					value.delta = value.to - value.from;
				}
				if (value.delta) {
					value.last = (value.delta < 0) ? 0.99 : -0.99;
					value.start = now;
					this.__frames[key].push(value);
				}
			}
		},
		_step: function (timestamp) {
			this.beforeStep();
			if (this.__stoped) {
				return
			}
			this.__doing = true;
			var hasFrame = 0;
			var now = Date.now();
			var duration = this.duration;
			var delta, item, finished, elapsed, position, que, total;
			for (var key in this.__frames) {
				if (!this.__frames.hasOwnProperty(key)) {
					return;
				}
				hasFrame++;
				que = this.__frames[key];
				total = 0;
				for (var i = 0; i < que.length; i++) {
					item = que[i];
					elapsed = now - item.start;
					finished = (elapsed >= duration);

					// scroll position: [0, 1]
					if (typeof this.timing == 'function') {
						position = this.timing((finished) ? 1 : elapsed / duration);
					} else {
						position = timing[this.timing]((finished) ? 1 : elapsed / duration);
					}


					// only need the difference
					delta = (item.delta * position - item.last) >> 0;

					// add this to the total
					total += delta;

					// update last values
					item.last += delta;

					// delete and step back if it's over
					if (finished) {
						que.splice(i, 1);
						i--;
					}
				}

				this.stepCallback(key, total);
				if (!que.length) {
					delete this.__frames[key];
					hasFrame--;
				}
			}
			if (hasFrame) {
				requestAnimationFrameHelper.call(window, bind(this._step, this));
			} else {
				this._stepEnd();
			}

		}
	});
	helper.apply(ZAnimate.prototype, {
		beforeStep: function () {
			//检查当前动画是否能够继续执行，比如element被删除会导致执行失败，需要终止动画继续执行
			//this.stop();
		},
		stepCallback: function (key, total) {
			this.trigger('zAnimating', key, total);
		},
		/**
		 * 添加更多的动画关键帧,一个dom只需要一个animate对象，所有动画都 又这个对象处理
		 * @param property
		 */
		run: function (property) {
			if (property) {
				this._pushFrame(property);
				if (!this.isDoing()) {
					this.start();
				}
			}
		},
		start: function () {
			this.__stoped = false;
			this.__doing = false;
			this.trigger('zAnimateStart');
			requestAnimationFrameHelper.call(window, bind(this._step, this));
		},
		isDoing: function () {
			return this.__doing;
		},
		stop: function () {
			if (this.isDoing()) {
				this.__stoped = true;
				this.trigger('zAnimateStop');
				this._stepEnd();
			}
			return this;
		}
	});
	helper.apply(ZAnimate.prototype, {
		__listeners: {},
		on: function (name, fn, scope, once) {
			var listener = this.__listeners[name] || [];
			listener.push({
				name: name,
				fn: fn,
				once: once,
				scope: scope || this
			});
			this.__listeners[name] = listener;
		},
		off: function (name, fn, scope) {
			var listeners = this.__listeners[name] || [], listener;
			if (fn === undefined && scope === undefined) {
				delete this.__listeners[name];
				return;
			}
			for (var i = 0; i < listeners.length; i++) {
				listener = listeners[i];
				if (fn === listener.fn && (scope === undefined || scope === listener.scope)) {
					listeners.splice(i, 1);
					i--;
				}
			}
		},
		once: function (name, fn, scope) {
			this.on(name, fn, scope, 'true');
		},
		trigger: function (name) {
			var args = Array.prototype.slice.call(arguments, 1);
			var listeners = this.__listeners[name] || [], listener;
			for (var i = 0; i < listeners.length; i++) {
				listener = listeners[i];
				listener.fn.apply(listener.scope, args);
				if (listener.once) {
					listeners.splice(i, 1);
					i--;
				}
			}
		}
	});

	if (typeof module != 'undefined' && module.exports) {
		module.exports = ZAnimate;
	} else if (typeof define == 'function' && define.amd) {
		define(function () {
			return ZAnimate;
		});
	} else {
		window.ZAnimate = ZAnimate;
	}
})(window, undefined);
},{"./helper":6}],8:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class config
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
module.exports = {
	handlers: ['click-rail', 'drag-bar', 'keyboard', 'wheel', 'touch', 'selection'],
	wrapElement: false,//是否包裹滚动元素,可以解决在ie8，ie9下面滚动条抖动问题,但是会对被滚动元素包裹一层div
	/**
	 *  scroll bar min size (height or width)
	 */
	barMinSize: 20,
	wheelSpeed: 1,
	keyScrollIncrement: 100,//key step
	autoHideBar: true,
	stopPropagationOnClick: true,
	wheelPropagation: true,
	swipePropagation: true,
	forceUpdate: true,//如果需要对textArea进行滚动操作，需要注意将wrapElement开启，并将此项关闭
	autoUpdate: true//自动更新
};
},{}],9:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class destroy
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('./instances');

module.exports = function (element) {
	var i = instances.get(element);

	if (!i) {
		return;
	}
	instances.remove(element);
};

},{"./instances":18}],10:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class click-bar
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var update = require('../update');
var helper = require('../../lib/helper');
function pageOffset(el) {
	return el.getBoundingClientRect();
}
function stopPropagation(e) {
	helper.stopPropagation(e);
}
function bindClickRailXHandler(element, instance) {
	if (instance.config.stopPropagationOnClick) {
		instance.event.on(instance.barX, 'click', stopPropagation);
	}
	instance.event.on(instance.barXRail, 'click', function (e) {
		var halfOfbarSize = helper.toInt(instance.barXWidth / 2);
		var offset = 0;
		if (typeof window.pageXOffset !== 'undefined') {
			offset = window.pageXOffset;
		}
		var pageX = e.pageX;
		if (typeof  e.pageX === 'undefined') {
			pageX = e.clientX;
		}
		var positionLeft = instance.railXRatio * (pageX - offset - pageOffset(instance.barXRail).left - halfOfbarSize);
		var maxPositionLeft = instance.railXRatio * (instance.railXWidth - instance.barXWidth);
		var positionRatio = positionLeft / maxPositionLeft;

		if (positionRatio < 0) {
			positionRatio = 0;
		} else if (positionRatio > 1) {
			positionRatio = 1;
		}
		var left = ((instance.contentWidth - instance.containerWidth) * positionRatio);
		instance.animate.run({
			left: {delta: left - instance.currentLeft}
		});
		helper.stopPropagation(e);
	});
}
function bindClickRailYHandler(element, instance) {
	if (instance.config.stopPropagationOnClick) {
		instance.event.on(instance.barY, 'click', stopPropagation);
	}
	instance.event.on(instance.barYRail, 'click', function (e) {
		var halfOfScrollbarLength = helper.toInt(instance.barYHeight / 2);
		var offset = 0;
		if (typeof window.window.pageYOffset !== 'undefined') {
			offset = window.window.pageYOffset;
		}
		var pageY = e.pageY;
		if (typeof  e.pageY === 'undefined') {
			pageY = e.clientY;
		}
		var positionTop = instance.railYRatio * (pageY - offset - pageOffset(instance.barYRail).top - halfOfScrollbarLength);
		var maxPositionTop = instance.railYRatio * (instance.railYHeight - instance.barYHeight);
		var positionRatio = positionTop / maxPositionTop;
		if (positionRatio < 0) {
			positionRatio = 0;
		} else if (positionRatio > 1) {
			positionRatio = 1;
		}
		var top = (instance.contentHeight - instance.containerHeight) * positionRatio;
		instance.animate.run({
			top: {delta: top - instance.currentTop}
		});
		helper.stopPropagation(e);
	});
}
module.exports = function (element) {
	var instance = instances.get(element);
	bindClickRailXHandler(element, instance);
	bindClickRailYHandler(element, instance);
};
},{"../../lib/helper":6,"../instances":18,"../update":21}],11:[function(require,module,exports){
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
		updateScrollLeft(helper.getPageX(e) - currentPageX);
		helper.stopPropagation(e);
		helper.preventDefault(e);
	};

	var mouseUpHandler = function () {
		instance.stopScrolling('x');
		dom.removeClass(instance.barXRail, 'drag');
		instance.event.off(instance.ownerDocument, 'mousemove', mouseMoveHandler);
	};
	instance.event.on(instance.barX, 'mousedown', function (e) {
		currentPageX = helper.getPageX(e);
		currentLeft = instance.barX.offsetLeft * instance.railXRatio;
		instance.startScrolling('x');
		dom.addClass(instance.barXRail, 'drag');
		instance.event.on(instance.ownerDocument, 'mousemove', mouseMoveHandler);
		instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);

		helper.stopPropagation(e);
		helper.preventDefault(e);
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
		updateScrollTop(helper.getPageY(e) - currentPageY);
		helper.stopPropagation(e);
		helper.preventDefault(e);
	};

	var mouseUpHandler = function () {
		instance.stopScrolling('y');
		dom.removeClass(instance.barYRail, 'drag');
		instance.event.off(instance.ownerDocument, 'mousemove', mouseMoveHandler);
	};

	instance.event.on(instance.barY, 'mousedown', function (e) {
		currentPageY = helper.getPageY(e);
		currentTop = instance.barY.offsetTop * instance.railYRatio;
		instance.startScrolling('y');
		dom.addClass(instance.barYRail, 'drag');
		instance.event.on(instance.ownerDocument, 'mousemove', mouseMoveHandler);
		instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);
		helper.stopPropagation(e);
		helper.preventDefault(e);
	});
}

module.exports = function (element) {
	var instance = instances.get(element);
	bindMouseScrollXHandler(element, instance);
	bindMouseScrollYHandler(element, instance);
};
},{"../../lib/dom":2,"../../lib/helper":6,"../instances":18,"../update":21,"../update-scroll":20}],12:[function(require,module,exports){
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
		instance.animate.run({
			top: {
				delta: deltaY
			},
			left: {
				delta: deltaX
			}
		});
	});
}
module.exports = function (element) {
	bindKeyBoard(element);
};
},{"../../lib/helper":6,"../instances":18,"../update":21}],13:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class mouse-wheel
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var update = require('../update');
var helper = require('../../lib/helper');

function bindMouseWheelHandler(element, instance) {
	var shouldPrevent = false;

	function shouldPreventDefault(deltaX, deltaY) {
		var scrollTop = element.scrollTop;
		if (deltaX === 0) {
			if (!instance.barYActive) {
				return false;
			}
			if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= instance.maxTop && deltaY < 0)) {
				return !instance.config.wheelPropagation;
			}
		}

		var scrollLeft = element.scrollLeft;
		if (deltaY === 0) {
			if (!instance.barXActive) {
				return false;
			}
			if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= instance.maxLeft && deltaX > 0)) {
				return !instance.config.wheelPropagation;
			}
		}
		return true;
	}

	function getDeltaFromEvent(e) {
		var deltaX = e.deltaX;
		var deltaY = -1 * e.deltaY;
		if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
			// OS X Safari
			deltaX = -1 * e.wheelDeltaX / 6;
			deltaY = e.wheelDeltaY / 6;
		}

		if (e.deltaMode && e.deltaMode === 1) {
			// Firefox in deltaMode 1 means 3 Line scrolling
			deltaX *= 100 / 3;
			deltaY *= 100 / 3;
		}

		if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
			// IE in some mouse drivers
			deltaX = 0;
			deltaY = e.wheelDelta;
		}
		if (helper.env.isEdge) {
			deltaX *= 100 / 130;
			deltaY *= 100 / 130;
		}
		return [-deltaX, deltaY];
	}

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

	function mousewheelHandler(e) {
		var delta = getDeltaFromEvent(e.originalEvent || e);

		var deltaX = delta[0];
		var deltaY = delta[1];
		var newTop, newLeft, perporty = {};
		if (shouldBeConsumedByChild(deltaX, deltaY)) {
			return;
		}
		shouldPrevent = false;
		if (instance.barYActive && instance.barXActive) {
			perporty.top = {delta: -(deltaY * instance.config.wheelSpeed)};
			perporty.left = {delta: -(deltaX * instance.config.wheelSpeed)};
		} else if (instance.barYActive && !instance.barXActive) {
			if (deltaY) {
				newTop = -(deltaY * instance.config.wheelSpeed)
			} else {
				newTop = -(deltaX * instance.config.wheelSpeed);
			}
			perporty.top = {delta: newTop};
		} else if (instance.barXActive && !instance.barYActive) {
			if (deltaX) {
				newLeft = -(deltaX * instance.config.wheelSpeed);
			} else {
				newLeft = -(deltaY * instance.config.wheelSpeed);
			}
			perporty.left = {delta: newLeft};
		}
		instance.animate.run(perporty);

		if (shouldPreventDefault(deltaX, deltaY)) {
			helper.stopPropagation(e);
			helper.preventDefault(e);
		}
	}

	if (typeof window.onwheel !== "undefined") {
		instance.event.on(element, 'wheel', mousewheelHandler);
	} else if (typeof window.onmousewheel !== "undefined") {
		instance.event.on(element, 'mousewheel', mousewheelHandler);
	} else if (typeof instance.ownerDocument.onmousewheel !== 'undefined') {
		instance.event.on(element, 'mousewheel', mousewheelHandler);
	}
}

module.exports = function (element) {
	var instance = instances.get(element);
	bindMouseWheelHandler(element, instance);
};

},{"../../lib/helper":6,"../instances":18,"../update":21}],14:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class native-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var updateBar = require('../update-bar');
var update = require('../update');
function bindNativeScroll(element) {
	var instance = instances.get(element);
	instance.event.on(element, 'scroll', function () {
		if(instance.config.autoUpdate) {
			update(element);
		}
		if (instance.animate.isDoing()) {
			return;
		}
		if (instance.currentLeft !== element.scrollLeft || instance.currentTop !== element.scrollTop) {
			instance.currentLeft = instance.getTrueLeft(element.scrollLeft);
			instance.currentTop = instance.getTrueTop(element.scrollTop);
			updateBar(element);
		}

	});
}
module.exports = function (element) {
	bindNativeScroll(element);
};
},{"../instances":18,"../update":21,"../update-bar":19}],15:[function(require,module,exports){
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
function bindSelectionHandler(element, instance) {
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
				instance.animate.run({
					top: {delta: scrollDiff.top},
					left: {delta: scrollDiff.left}
				});
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
	if (dom.css(element, 'overflow') === 'auto') {//本地滚动的selection修复
		instance.event.on(element, 'mousedown', function () {
			dom.addClass(instance.wrapElement, 'selection');
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

},{"../../lib/dom":2,"../../lib/helper":6,"../instances":18}],16:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class touch
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
'use strict';

var helper = require('../../lib/helper');
var instances = require('../instances');
var updateScroll = require('../update-scroll');
var dom = require('../../lib/dom');

function bindTouchHandler(element, instance, supportsTouch, supportsIePointer) {
	function shouldPreventDefault(deltaX, deltaY) {
		var currentTop = instance.currentTop;
		var currentLeft = instance.currentLeft;
		var magnitudeX = Math.abs(deltaX);
		var magnitudeY = Math.abs(deltaY);

		if (magnitudeY > magnitudeX) {
			// user is perhaps trying to swipe up/down the page

			if (((deltaY < 0) && (currentTop === instance.contentHeight - instance.containerHeight)) ||
				((deltaY > 0) && (currentTop === 0))) {
				return !instance.config.swipePropagation;
			}
		} else if (magnitudeX > magnitudeY) {
			// user is perhaps trying to swipe left/right across the page

			if (((deltaX < 0) && (currentLeft === instance.contentWidth - instance.containerWidth)) ||
				((deltaX > 0) && (currentLeft === 0))) {
				return !instance.config.swipePropagation;
			}
		}

		return true;
	}

	function applyTouchMove(differenceX, differenceY) {
		updateScroll(element, 'top', instance.currentTop - differenceY);
		updateScroll(element, 'left', instance.currentLeft - differenceX);
	}

	var startOffset = {};
	var startTime = 0;
	var speed = {};
	var inGlobalTouch = false;
	var inLocalTouch = false;
	var momentun = {
		_doing: false,
		duration: 300,
		start: function (speed) {
			this.lastPosition = [0, 0];
			this.startTime = new Date().getTime();
			var frame = {
				speed: speed
			};
			frame.accelerate = {
				x: -speed.x / this.duration,
				y: -speed.y / this.duration
			};
			this._frame = frame;
			this._doing = true;
			helper.requestAnimationFrameHelper.call(window, this.step.bind(this));
		},
		getPosition: function (t) {
			var speed = this._frame.speed;
			var accelerate = this._frame.accelerate;
			return [
				speed.x == 0 ? 0 : (Math.pow(speed.x, 2) - Math.pow(speed.x - t * accelerate.x, 2)) / (2 * accelerate.x),
				speed.y == 0 ? 0 : (Math.pow(speed.y, 2) - Math.pow(speed.y - t * accelerate.y, 2)) / (2 * accelerate.y)
			];
		},
		step: function () {
			if (!this._doing) {
				return;
			}
			var now = new Date().getTime();
			var elapsed = now - this.startTime;
			var finish = elapsed >= this.duration;
			var position = this.getPosition(finish ? this.duration : elapsed);
			var lp = this.lastPosition;
			updateScroll(element, 'left', instance.currentLeft + position[0] - lp[0]);
			updateScroll(element, 'top', instance.currentTop + position[1] - lp[1]);
			this.lastPosition = position;
			if (finish) {
				this._doing = false;
			} else {
				helper.requestAnimationFrameHelper.call(window, this.step.bind(this));
			}
		},
		end: function () {
			this._doing = false;
		}
	}

	function globalTouchStart() {
		inGlobalTouch = true;
	}

	function globalTouchEnd() {
		inGlobalTouch = false;
	}

	function getTouch(e) {
		if (e.targetTouches) {
			return e.targetTouches[0];
		} else {
			// Maybe IE pointer
			return e;
		}
	}

	function shouldHandle(e) {
		if (e.targetTouches && e.targetTouches.length === 1) {
			return true;
		}
		if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
			return true;
		}
		return false;
	}

	function touchStart(e) {
		momentun.end();
		dom.addClass(instance.wrapElement, 'touch');
		if (shouldHandle(e)) {
			inLocalTouch = true;

			var touch = getTouch(e);

			startOffset.pageX = touch.pageX;
			startOffset.pageY = touch.pageY;

			startTime = (new Date()).getTime();
			instance.animate.stop();

			helper.stopPropagation(e);
		}
	}

	function touchMove(e) {
		if (!inLocalTouch && instance.config.swipePropagation) {
			//touchStart(e);
		}
		if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
			var touch = getTouch(e);

			var currentOffset = {
				pageX: touch.pageX,
				pageY: touch.pageY
			};

			var differenceX = currentOffset.pageX - startOffset.pageX;
			var differenceY = currentOffset.pageY - startOffset.pageY;

			applyTouchMove(differenceX, differenceY);
			startOffset = currentOffset;

			var currentTime = (new Date()).getTime();

			var timeGap = currentTime - startTime;
			if (timeGap > 0) {
				speed.x = differenceX / timeGap;
				speed.y = differenceY / timeGap;
				startTime = currentTime;
			}

			if (shouldPreventDefault(differenceX, differenceY)) {
				helper.stopPropagation(e);
				helper.preventDefault(e);
			}
		}
	}


	function touchEnd() {
		dom.removeClass(instance.wrapElement, 'touch');
		if (!inGlobalTouch && inLocalTouch) {
			inLocalTouch = false;
			momentun.start({
				x: -speed.x,
				y: -speed.y
			});

		}
	}

	if (supportsTouch) {
		instance.event.on(window, 'touchstart', globalTouchStart);
		instance.event.on(window, 'touchend', globalTouchEnd);

		instance.event.on(element, 'touchstart', touchStart);
		instance.event.on(element, 'touchmove', touchMove);
		instance.event.on(element, 'touchend', touchEnd);
	}

	if (supportsIePointer) {
		if (window.PointerEvent) {
			instance.event.on(window, 'touchstart', 'pointerdown', globalTouchStart);
			instance.event.on(window, 'touchstart', 'pointerup', globalTouchEnd);

			instance.event.on(element, 'pointerdown', touchStart);
			instance.event.on(element, 'pointermove', touchMove);
			instance.event.on(element, 'pointerup', touchEnd);
		} else if (window.MSPointerEvent) {
			instance.event.on(window, 'touchstart', 'MSPointerDown', globalTouchStart);
			instance.event.on(window, 'touchstart', 'MSPointerUp', globalTouchEnd);

			instance.event.on(element, 'MSPointerDown', touchStart);
			instance.event.on(element, 'MSPointerMove', touchMove);
			instance.event.on(element, 'MSPointerUp', touchEnd);
		}
	}
}

module.exports = function (element) {
	if (!helper.env.supportsTouch && !helper.env.supportsIePointer) {
		return;
	}
	bindTouchHandler(element, instances.get(element), helper.env.supportsTouch, helper.env.supportsIePointer);
};
},{"../../lib/dom":2,"../../lib/helper":6,"../instances":18,"../update-scroll":20}],17:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class initialize
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
// Handlers
require('../lib/fixed');
var handlers = {
	'click-rail': require('./handler/click-rail'),
	'drag-bar': require('./handler/drag-bar'),
	'keyboard': require('./handler/keyboard'),
	'wheel': require('./handler/mouse-wheel'),
	'touch': require('./handler/touch'),
	'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');
var instances = require('./instances');
var update = require('./update');
var updateScroll = require('./update-scroll');
var config = require('./config');
var dom = require('../lib/dom');
var helper = require('../lib/helper');
module.exports = function (element, cfg) {
	cfg = typeof cfg === 'object' ? cfg : {};
	if (instances.get(element)) {
		return;
	}
	var instance = instances.add(element, helper.apply(config, cfg));
	instance.config.handlers.forEach(function (handlerName) {
		handlers[handlerName](element);
	});

	nativeScrollHandler(element);

	instance.animate.stepCallback = function (key, value) {
		switch (key) {
			case 'top':
				updateScroll(element, key, instance.currentTop + value);
				break;
			case 'left':
				updateScroll(element, key, instance.currentLeft + value);
				break;
		}
	};
	update(element);
};
},{"../lib/dom":2,"../lib/fixed":4,"../lib/helper":6,"./config":8,"./handler/click-rail":10,"./handler/drag-bar":11,"./handler/keyboard":12,"./handler/mouse-wheel":13,"./handler/native-scroll":14,"./handler/selection":15,"./handler/touch":16,"./instances":18,"./update":21,"./update-scroll":20}],18:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class instances
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var guid = require('../lib/guid');
var helper = require('../lib/helper');
var instances = {};
var zAnimate = require('../lib/z-animate');
var EventManager = require('../lib/event-manager');
var dom = require('../lib/dom');
function Instance(element, config) {
	var instance = this;
	instance.element = element;
	instance.config = config;
	instance.event = new EventManager();
	instance.animate = new zAnimate({
		status: null,
		beforeStep: function () {
			if (!element.parentNode) {
				this.stop();
			}
		}
	});
	helper.apply(this, {
		containerWidth: null,
		containerHeight: null,
		contentWidth: null,
		contentHeight: null,
		vertical: -1, //-1顶部,1底部,0中间
		horizontal: -1, //-1左边，1右边，0中间
		maxLeft: 0,
		maxTop: 0,
		currentLeft: 0,
		currentTop: 0
	});
	instance.ownerDocument = element.ownerDocument || document;

	dom.addClass(element, 'super-scrollbar-box');
	var wrapElement = element;
	if (instance.config.wrapElement) {
		wrapElement = dom.element('div', 'super-scrollbar-wrap');
		dom.wrap(element, wrapElement);
	}
	dom.addClass(wrapElement, 'super-scrollbar');
	if (!instance.config.autoHideBar) {
		dom.addClass(wrapElement, 'ss-no-auto-hide');
	}
	switch (dom.css(element, 'position')) {
		case 'absolute':
		case 'relative':
		case 'fixed':
			break;
		default :
			dom.addClass(wrapElement, 'ss-position');
			break;

	}
	instance.wrapElement = wrapElement;
	/*创建横向滚动条*/
	instance.barXRail = dom.element('div', 'ss-scrollbar-x-rail');
	dom.appendTo(instance.barXRail, wrapElement);
	instance.event.on(instance.barXRail, 'focus', function () {
		dom.addClass(instance.barXRail, 'ss-focus');
	});
	instance.event.on(instance.barXRail, 'blur', function () {
		dom.removeClass(instance.barXRail, 'ss-focus');
	});
	instance.barX = dom.element('div', 'ss-scrollbar-x');
	dom.appendTo(instance.barX, instance.barXRail);
	instance.railXWidth = null;
	instance.railXRatio = 1;
	instance.barXActive = false;
	instance.barXWidth = null;
	/*创建垂直滚动条*/
	instance.barYRail = dom.element('div', 'ss-scrollbar-y-rail');
	dom.appendTo(instance.barYRail, wrapElement);
	instance.event.on(instance.barYRail, 'focus', function () {
		dom.addClass(instance.barYRail, 'ss-focus');
	});
	instance.event.on(instance.barYRail, 'blur', function () {
		dom.removeClass(instance.barYRail, 'ss-focus');
	});
	instance.barY = dom.element('div', 'ss-scrollbar-y');
	dom.appendTo(instance.barY, instance.barYRail);
	instance.railYHeight = null;
	instance.railYRatio = 1;
	instance.barYActive = false;
	instance.barYWidth = null;
}
Instance.prototype = {
	getTrueTop: function (newTop) {
		newTop = helper.toInt(newTop);
		var maxTop = this.maxTop;
		if (newTop < 0) {
			newTop = 0;
		} else if (newTop > maxTop) {
			newTop = maxTop;
		}
		return newTop;
	},
	setCurrentTop: function (newTop) {
		this.currentTop = this.getTrueTop(newTop);
	},
	getTrueLeft: function (newLeft) {
		newLeft = helper.toInt(newLeft);
		var maxLeft = this.maxLeft;
		if (newLeft < 0) {
			newLeft = 0;
		} else if (newLeft > maxLeft) {
			newLeft = maxLeft;
		}
		return newLeft;
	},
	setCurrentLeft: function (newLeft) {
		this.currentLeft = this.getTrueLeft(newLeft);
	},
	startScrolling: function (axis) {
		dom.addClass(this.wrapElement, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			dom.addClass(this.wrapElement, 'ss-' + axis);
		} else {
			dom.addClass(this.wrapElement, 'ss-x');
			dom.addClass(this.wrapElement, 'ss-y');
		}
	},

	stopScrolling: function (axis) {
		dom.removeClass(this.wrapElement, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			dom.removeClass(this.wrapElement, 'ss-' + axis);
		} else {
			dom.removeClass(this.wrapElement, 'ss-x');
			dom.removeClass(this.wrapElement, 'ss-y');
		}
	}

};
function getId(element) {
	return element.getAttribute('data-ss-id');
}

function setId(element, id) {
	element.setAttribute('data-ss-id', id);
}

function removeId(element) {
	element.removeAttribute('data-ss-id');
}

exports.add = function (element, config) {
	var newId = guid();
	setId(element, newId);
	instances[newId] = new Instance(element, config);
	return instances[newId];
};

exports.remove = function (element) {
	var instance = instances[getId(element)];
	instance.event.offAll();

	dom.remove(instance.barX);
	dom.remove(instance.barY);
	dom.remove(instance.barXRail);
	dom.remove(instance.barYRail);
	if (instance.config.wrapElement) {
		dom.unwrap(element);
	}

	element.removeAttribute('tabIndex');
	dom.removeClass(element, 'super-scrollbar ss-no-auto-hide super-scrollbar-box ss-active-x ss-active-y touch selection ss-position');
	delete instances[getId(element)];
	removeId(element);
};

exports.get = function (element) {
	return instances[getId(element)];
};

},{"../lib/dom":2,"../lib/event-manager":3,"../lib/guid":5,"../lib/helper":6,"../lib/z-animate":7}],19:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class update-bar
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('./instances');
var dom = require('../lib/dom');
module.exports = function (element) {
	var instance = instances.get(element), value;
	if (instance.barYActive) {
		value = instance.currentTop;
		dom.css(instance.barY, 'top', value / instance.railYRatio);

	}

	if (instance.barXActive) {
		value = instance.currentLeft;
		dom.css(instance.barX, 'left', value / instance.railXRatio);

	}
	/*更新rail位置*/
	if (!instance.config.wrapElement) {
		if (instance.barYActive) {
			dom.css(instance.barYRail, 'top', instance.currentTop);
			dom.css(instance.barYRail, 'right', -instance.currentLeft);
		}
		if (instance.barXActive) {
			dom.css(instance.barXRail, 'left', instance.currentLeft);
			dom.css(instance.barXRail, 'bottom', -instance.currentTop);
		}
	}
};
},{"../lib/dom":2,"./instances":18}],20:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class update-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('./instances');
var updateBar = require('./update-bar');
var dom = require('../lib/dom');

var upEvent = dom.createEvent('ss-scroll-up');
var downEvent = dom.createEvent('ss-scroll-down');
var leftEvent = dom.createEvent('ss-scroll-left');
var rightEvent = dom.createEvent('ss-scroll-right');
var yEvent = dom.createEvent('ss-scroll-y');
var xEvent = dom.createEvent('ss-scroll-x');
var xStartEvent = dom.createEvent('ss-x-reach-start');
var xEndEvent = dom.createEvent('ss-x-reach-end');
var yStartEvent = dom.createEvent('ss-y-reach-start');
var yEndEvent = dom.createEvent('ss-y-reach-end');

var lastTop;
var lastLeft;
module.exports = function (element, axis, value) {
	if (typeof element === 'undefined') {
		throw 'You must provide an element to the update-scroll function';
	}

	if (typeof axis === 'undefined') {
		throw 'You must provide an axis to the update-scroll function';
	}

	if (typeof value === 'undefined') {
		throw 'You must provide a value to the update-scroll function';
	}

	if (axis === 'top' && value <= 0) {
		element.scrollTop = value = 0; // don't allow negative scroll
		dom.dispatchEvent(element, yStartEvent);
	}

	if (axis === 'left' && value <= 0) {
		element.scrollLeft = value = 0; // don't allow negative scroll
		dom.dispatchEvent(element, xStartEvent);
	}

	var instance = instances.get(element);

	if (axis === 'top' && value >= instance.maxTop) {
		// don't allow scroll past container
		value = instance.maxTop;
		if (value - element.scrollTop <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			// fix edge buge
			//value = element.scrollTop;
		} else {
			element.scrollTop = value;
		}
		dom.dispatchEvent(element, yEndEvent);
	}

	if (axis === 'left' && value >= instance.maxLeft) {
		// don't allow scroll past container
		value = instance.maxLeft;
		if (value - element.scrollLeft <= 1) {
			// mitigates rounding errors on non-subpixel scroll values
			//fix edge buge
			//value = element.scrollLeft;
		} else {
			element.scrollLeft = value;
		}
		dom.dispatchEvent(element, xEndEvent);
	}

	if (!lastTop) {
		lastTop = element.scrollTop;
	}

	if (!lastLeft) {
		lastLeft = element.scrollLeft;
	}

	if (axis === 'top' && value < lastTop) {
		dom.dispatchEvent(element, upEvent);
	}

	if (axis === 'top' && value > lastTop) {
		dom.dispatchEvent(element, downEvent);
	}

	if (axis === 'left' && value < lastLeft) {
		dom.dispatchEvent(element, leftEvent);
	}

	if (axis === 'left' && value > lastLeft) {
		dom.dispatchEvent(element, rightEvent);
	}
	if (axis === 'top') {
		instance.currentTop = lastTop = value;
		updateBar(element);
		element.scrollTop = instance.currentTop;
		dom.dispatchEvent(element, yEvent);
	}

	if (axis === 'left') {
		instance.currentLeft = lastLeft = value;
		updateBar(element);
		element.scrollLeft = instance.currentLeft;
		dom.dispatchEvent(element, xEvent);
	}

};
},{"../lib/dom":2,"./instances":18,"./update-bar":19}],21:[function(require,module,exports){
/**
 * Created by z-man on 2016/7/21.
 * @class update
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('./instances');
var helper = require('../lib/helper');
var dom = require('../lib/dom');
var updateScroll = require('./update-scroll');
function updateRect(element, instance) {
	if (instance.config.forceUpdate) {
		//修复在chrome中overflow:hidden，情况下scrollHeight不能正确获取
		var tmp = dom.element('div', '');
		dom.appendTo(tmp, element);
		instance.contentHeight = tmp.offsetTop;
		dom.remove(tmp);
	} else {
		instance.contentHeight = element.scrollHeight;
	}
	instance.contentWidth = element.scrollWidth;

	instance.containerWidth = element.clientWidth;
	instance.containerHeight = element.clientHeight;
}
function updateHanlder(element, instance) {
	instance.currentLeft = element.scrollLeft;
	instance.currentTop = element.scrollTop;

	updateRect(element, instance);

	instance.maxLeft = Math.max(0, instance.contentWidth - instance.containerWidth);
	instance.maxTop = Math.max(0, instance.contentHeight - instance.containerHeight);
	instance.barYActive = instance.contentHeight > instance.containerHeight;
	instance.barXActive = instance.contentWidth > instance.containerWidth;

	var railSize, barSize;
	var wrapElement = instance.wrapElement;
	if (instance.barXActive) {
		railSize = instance.containerWidth;
		dom.addClass(wrapElement, 'ss-active-x');
		dom.width(instance.barXRail, railSize);
		instance.railXWidth = railSize;
		barSize = Math.max(instance.containerWidth / instance.contentWidth * railSize, instance.config.barMinSize);
		dom.width(instance.barX, barSize);
		instance.barXWidth = barSize;
		instance.railXRatio = Math.max((instance.contentWidth - instance.containerWidth) / (railSize - barSize), 1);
		updateScroll(element, 'left', instance.currentLeft);
	} else {
		instance.currentLeft = 0;
		dom.removeClass(wrapElement, 'ss-active-x');
	}

	if (instance.barYActive) {
		dom.addClass(wrapElement, 'ss-active-y');
		railSize = instance.containerHeight;
		dom.height(instance.barYRail, railSize);
		instance.railYHeight = railSize;
		barSize = Math.max(instance.containerHeight / instance.contentHeight * railSize, instance.config.barMinSize);
		dom.height(instance.barY, barSize);
		instance.barYHeight = barSize;

		instance.railYRatio = Math.max((instance.contentHeight - instance.containerHeight) / (railSize - barSize), 1);
		updateScroll(element, 'top', instance.currentTop);
	} else {
		instance.currentTop = 0;
		dom.removeClass(wrapElement, 'ss-active-y');
	}
}
module.exports = function (element) {
	var instance = instances.get(element);
	if (!instance) {
		return;
	}
	updateHanlder(element, instance);
};
},{"../lib/dom":2,"../lib/helper":6,"./instances":18,"./update-scroll":20}]},{},[1]);
