/**
 * Created by z-man on 2016/7/21.
 * @class instances
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var util = require('../lib/util');
var config = require('./config');
var guid = require('../lib/guid');
var helper = require('../lib/helper');
var instances = {};
var $ = require('../lib/dom');
function Instance(element) {
	var instance = this;
	var $element = $(element);
	instance.config = util.apply({}, config);
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
	/*检测是否是反向滚动*/
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

	$element.wrapInner('<div class="ss-content"></div>');
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
	instance.railXShow = false;
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
	instance.railYShow = false;
	instance.barYWidth = null;
	$element.on('scroll',function(){

	})
}

function getId(element) {
	return element.getAttribute('data-ss-id');
}

function setId(element, id) {
	element.setAttribute('data-ss-id', id);
}

function removeId(element) {
	element.removeAttribute('data-ss-id');
}

exports.add = function (element) {
	var newId = guid();
	setId(element, newId);
	instances[newId] = new Instance(element);
	return instances[newId];
};

exports.remove = function (element) {
	var instance = instances[getId(element)];
	$(element).find('.ss-content').first().unwrap(); //移除插入的content包裹元素
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