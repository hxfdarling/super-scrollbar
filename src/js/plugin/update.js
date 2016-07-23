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
module.exports = function (element) {
	var instance = instances.get(element);
	if (!instance) {
		return;
	}
	var $element = $(element);
	// Recalcuate negative scrollLeft adjustment
	instance.negativeScrollAdjustment = instance.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
	if (instance.config.scrollModel !== 'native') {
		//采用position，或者transition
		var $content = $element.find('.ss-content');
		instance.contentWidth = $content.width();
		instance.contentHeight = $content.height();
	} else {
		//采用本地化滚动
		instance.contentWidth = element.scrollWidth;
		instance.contentHeight = element.scrollHeight;
	}

	instance.containerWidth = $element.width();
	instance.containerHeight = $element.height();
	instance.maxLeft = Math.max(0, instance.contentWidth - instance.containerWidth);
	instance.maxTop = Math.max(0, instance.contentHeight - instance.containerHeight);
	instance.barYActive = instance.contentHeight > instance.containerHeight;
	instance.barXActive = instance.contentWidth > instance.containerWidth;
	var railSize, barSize;
	if (instance.barXActive) {
		$element.addClass('ss-active-x');
		instance.barXRail.width(instance.containerWidth);
		instance.railXWidth = instance.barXRail.width();
		railSize = instance.containerWidth;
		barSize = Math.max(instance.containerWidth / instance.contentWidth * railSize, instance.config.barMinSize);
		instance.barX.width(barSize);
		instance.barXWidth = barSize;
		instance.railXRatio = Math.max((instance.contentWidth - instance.containerWidth) / (railSize - barSize), 1);
		updateScroll(element, 'left', 0);
	} else {
		$element.removeClass('ss-active-x');
	}

	if (instance.barYActive) {
		$element.addClass('ss-active-y');
		instance.barYRail.height(instance.containerHeight);
		instance.railYHeight = instance.barYRail.height();
		railSize = instance.containerHeight;
		barSize = Math.max(instance.containerHeight / instance.contentHeight * railSize, instance.config.barMinSize);
		instance.barY.height(barSize);
		instance.barYHeight = barSize;

		instance.railYRatio = Math.max((instance.contentHeight - instance.containerHeight) / (railSize - barSize), 1);
		updateScroll(element, 'top', 0);
	} else {
		$element.removeClass('ss-active-y');
	}
};
