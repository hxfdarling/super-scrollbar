/**
 * Created by z-man on 2016/7/21.
 * @class instances
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var util = require('../lib/util');
var guid = require('../lib/guid');
var helper = require('../lib/helper');
var instances = {};
var zAnimate = require('../lib/z-animate');
var $ = require('../lib/jquery-bridge');
function Instance(element, config) {
	var instance = this;
	var $element = $(element);
	instance.element = element;
	instance.config = config;
	instance.animate = new zAnimate({
		status: null,
		beforeStep: function () {
			if (!element.parentNode) {
				this.stop();
			}
		}
	});
	util.apply(this, {
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
	instance.isNegativeScroll = (function () {
		var originalScrollLeft = element.scrollLeft;
		var result;
		element.scrollLeft = -1;
		result = element.scrollLeft < 0;
		element.scrollLeft = originalScrollLeft;
		return result;
	})();
	instance.negativeScrollAdjustment = instance.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
	instance.ownerDocument = element.ownerDocument || document;
	$element.addClass('super-scrollbar');
	/*创建横向滚动条*/
	instance.barXRail = $('<div class="ss-scrollbar-x-rail"></div>')
		.appendTo($element)
		.on({
			focus: function () {
				$(this).addClass('ss-focus');
			},
			blur: function () {
				$(this).removeClass('ss-focus');
			}
		});
	instance.barX = $('<div class="ss-scrollbar-x"></div>').appendTo(instance.barXRail);
	instance.railXWidth = null;
	instance.railXRatio = null;
	instance.barXActive = false;
	instance.barXWidth = null;
	/*创建垂直滚动条*/
	instance.barYRail = $('<div class="ss-scrollbar-y-rail" ></div>')
		.appendTo($element)
		.on({
			focus: function () {
				$(this).addClass('ss-focus');
			},
			blur: function () {
				$(this).removeClass('ss-focus');
			}
		});
	instance.barY = $('<div class="ss-scrollbar-y"></div>').appendTo(instance.barYRail);
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
		helper.addClass(this.element, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			helper.addClass(this.element, 'ss-' + axis);
		} else {
			helper.addClass(this.element, 'ss-x');
			helper.addClass(this.element, 'ss-y');
		}
	},

	stopScrolling: function (axis) {
		helper.removeClass(this.element, 'ss-in-scrolling');
		if (typeof axis !== 'undefined') {
			helper.removeClass(this.element, 'ss-' + axis);
		} else {
			helper.removeClass(this.element, 'ss-x');
			helper.removeClass(this.element, 'ss-y');
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
	if (instance.config.scrollModel !== 'native') {
		$(element).find('.ss-content').first().unwrap(); //移除插入的content包裹元素
	}
	$(element).unwrap(); //移除ss-box
	instance.barX.remove();
	instance.barY.remove();
	instance.barXRail.remove();
	instance.barYRail.remove();
	delete instances[getId(element)];
	removeId(element);
};

exports.get = function (element) {
	return instances[getId(element)];
};
