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
var $ = require('../../lib/jquery-bridge');
function pageOffset(el) {
	return el.getBoundingClientRect();
}
function stopPropagation(e) {
	e.stopPropagation();
}
function bindClickRailXHandler(element, instance) {
	if (instance.config.stopPropagationOnClick) {
		$(instance.barX).on('click', stopPropagation);
	}
	$(instance.barXRail).on('click', function (e) {
		var halfOfbarSize = helper.toInt(instance.barXWidth / 2);
		var positionLeft = instance.railXRatio * (e.pageX - window.pageXOffset - pageOffset(instance.barXRail[0]).left - halfOfbarSize);
		var maxPositionLeft = instance.railXRatio * (instance.railXWidth - instance.barXWidth);
		var positionRatio = positionLeft / maxPositionLeft;

		if (positionRatio < 0) {
			positionRatio = 0;
		} else if (positionRatio > 1) {
			positionRatio = 1;
		}
		var left = ((instance.contentWidth - instance.containerWidth) * positionRatio) - instance.negativeScrollAdjustment;
		instance.animate.run({
			left: {delta:left-instance.currentLeft}
		});
		e.stopPropagation();
	});
}
function bindClickRailYHandler(element, instance) {
	if (instance.config.stopPropagationOnClick) {
		$(instance.barY).on('click', stopPropagation);
	}
	$(instance.barYRail).on('click', function (e) {
		var halfOfScrollbarLength = helper.toInt(instance.barYHeight / 2);
		var positionTop = instance.railYRatio * (e.pageY - window.pageYOffset - pageOffset(instance.barYRail[0]).top - halfOfScrollbarLength);
		var maxPositionTop = instance.railYRatio * (instance.railYHeight - instance.barYHeight);
		var positionRatio = positionTop / maxPositionTop;
		if (positionRatio < 0) {
			positionRatio = 0;
		} else if (positionRatio > 1) {
			positionRatio = 1;
		}
		var top = (instance.contentHeight - instance.containerHeight) * positionRatio;
		instance.animate.run({
			top: {delta:top-instance.currentTop}
		});

		e.stopPropagation();
	});
}
module.exports = function (element) {
	var instance = instances.get(element);
	bindClickRailXHandler(element, instance);
	bindClickRailYHandler(element, instance);
};