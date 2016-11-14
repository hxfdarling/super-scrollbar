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
module.exports = function(element) {
	var instance = instances.get(element);
	if (!instance) {
		return;
	}
	updateHanlder(element, instance);
};