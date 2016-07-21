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
	var $element = $(element), $content = $element.find('.ss-content');
	// Recalcuate negative scrollLeft adjustment
	instance.negativeScrollAdjustment = instance.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
	instance.contentWidth = $content.width();
	instance.contentHeight = $content.height();
	instance.containerWidth = $element.width();
	instance.containerHeight = $element.height();
	instance.railYShow = instance.contentHeight > instance.containerHeight;
	instance.railXShow = instance.contentWidth > instance.containerWidth;
	var railOffset = 0, railSize, barSize;
	var barXRail = instance.barXRail, barYRail = instance.barYRail;
	if (instance.railXShow) {
		barXRail.removeClass('hide');
		instance.railYShow && ( railOffset = barYRail.width() + parseInt(barYRail.css('margin-right')));
		railSize = instance.containerWidth - railOffset;
		barSize = Math.max(instance.containerWidth / instance.contentWidth * railSize, instance.config.barMinSize);
		instance.barX.width(barSize);
		instance.railXRatio = Math.max((railSize - barSize) / (instance.contentWidth - instance.containerWidth), 1);
		updateScroll(element, 'left', 0);
	} else {
		barXRail.addClass('hide');
	}

	if (instance.railYShow) {
		barYRail.removeClass('hide');
		instance.railXShow && ( railOffset = barXRail.height() + parseInt(barXRail.css('margin-bottom')));
		railSize = instance.containerHeight - railOffset;
		barSize = Math.max(instance.containerHeight / instance.contentHeight * railSize, instance.config.barMinSize);
		instance.barY.height(barSize);
		instance.railYRatio = Math.max((railSize - barSize) / (instance.contentHeight - instance.containerHeight), 1);
		updateScroll(element, 'top', 0);
	} else {
		barYRail.addClass('hide');
	}
};
