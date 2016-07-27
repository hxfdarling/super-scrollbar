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
var updateScroll = require('../update-scroll');
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
		if (instance.config.animate) {
			instance.animate.run({
				left: {delta: left - instance.currentLeft}
			});
		} else {
			updateScroll(element,'left',left);
		}
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
		if(instance.config.animate) {
			instance.animate.run({
				top: {delta: top - instance.currentTop}
			});
		}else{
			updateScroll(element,'top',top);
		}
		helper.stopPropagation(e);
	});
}
module.exports = function (element) {
	var instance = instances.get(element);
	bindClickRailXHandler(element, instance);
	bindClickRailYHandler(element, instance);
};