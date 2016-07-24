/**
 * Created by z-man on 2016/7/21.
 * @class update
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('./instances');
var updateScroll = require('./update-scroll');
var helper = require('../lib/helper');
var dom = require('../lib/dom');
module.exports = function(element) {
	var instance = instances.get(element);
	if (!instance) {
		return;
	}
	//采用本地化滚动
	instance.contentWidth = element.scrollWidth;
	instance.contentHeight = element.scrollHeight;

	instance.containerWidth = dom.width(element);
	instance.containerHeight = dom.height(element);
	console.log(instance.containerHeight);
	instance.maxLeft = Math.max(0, instance.contentWidth - instance.containerWidth);
	instance.maxTop = Math.max(0, instance.contentHeight - instance.containerHeight);
	instance.barYActive = instance.contentHeight > instance.containerHeight;
	instance.barXActive = instance.contentWidth > instance.containerWidth;
	var railSize, barSize;
	if (instance.barXActive) {
		railSize = instance.containerWidth;
		dom.addClass(element, 'ss-active-x');
		dom.width(instance.barXRail, railSize);
		instance.railXWidth = railSize;
		barSize = Math.max(instance.containerWidth / instance.contentWidth * railSize, instance.config.barMinSize);
		dom.width(instance.barX, barSize);
		instance.barXWidth = barSize;
		instance.railXRatio = Math.max((instance.contentWidth - instance.containerWidth) / (railSize - barSize), 1);
		updateScroll(element, 'left', 0);
	} else {
		dom.removeClass(element, 'ss-active-x');
	}

	if (instance.barYActive) {
		dom.addClass(element, 'ss-active-y');
		railSize = instance.containerHeight;
		dom.height(instance.barYRail, railSize);
		instance.railYHeight = railSize;
		barSize = Math.max(instance.containerHeight / instance.contentHeight * railSize, instance.config.barMinSize);
		dom.height(instance.barY, barSize);
		instance.barYHeight = barSize;

		instance.railYRatio = Math.max((instance.contentHeight - instance.containerHeight) / (railSize - barSize), 1);
		updateScroll(element, 'top', 0);
	} else {
		dom.removeClass(element, 'ss-active-y');
	}
};