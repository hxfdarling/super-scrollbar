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
	dom.addClass(element, 'super-scrollbar');
	/*创建横向滚动条*/
	instance.barXRail = dom.element('div', 'ss-scrollbar-x-rail');
	dom.appendTo(instance.barXRail, element);
	instance.event.on(instance.barXRail, 'focus', function () {
		dom.addClass(instance.barXRail, 'ss-focus');
	});
	instance.event.on(instance.barXRail, 'blur', function () {
		dom.removeClass(instance.barXRail, 'ss-focus');
	});
	instance.barX = dom.element('div', 'ss-scrollbar-x');
	dom.appendTo(instance.barX, instance.barXRail);
	instance.railXWidth = null;
	instance.railXRatio = null;
	instance.barXActive = false;
	instance.barXWidth = null;
	/*创建垂直滚动条*/
	instance.barYRail = dom.element('div', 'ss-scrollbar-y-rail');
	dom.appendTo(instance.barYRail, element);
	instance.event.on(instance.barYRail, 'focus', function () {
		dom.addClass(instance.barYRail, 'ss-focus');
	});
	instance.event.on(instance.barYRail, 'blur', function () {
		dom.removeClass(instance.barYRail, 'ss-focus');
	});
	instance.barY = dom.element('div', 'ss-scrollbar-y');
	dom.appendTo(instance.barY, instance.barYRail);
	instance.railYHeight = null;
	instance.railYRatio = null;
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
		dom.addClass(this.element, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			dom.addClass(this.element, 'ss-' + axis);
		} else {
			dom.addClass(this.element, 'ss-x');
			dom.addClass(this.element, 'ss-y');
		}
	},

	stopScrolling: function (axis) {
		dom.removeClass(this.element, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			dom.removeClass(this.element, 'ss-' + axis);
		} else {
			dom.removeClass(this.element, 'ss-x');
			dom.removeClass(this.element, 'ss-y');
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
	instance.barX.remove();
	instance.barY.remove();
	instance.barXRail.remove();
	instance.barYRail.remove();
	instance.event.offAll();

	delete instances[getId(element)];
	removeId(element);
};

exports.get = function (element) {
	return instances[getId(element)];
};
