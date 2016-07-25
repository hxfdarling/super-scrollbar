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
		dom.css(instance.barYRail, 'top', value);
		if (instance.barXActive) {
			dom.css(instance.barXRail, 'bottom', -value);
		}
	}

	if (instance.barXActive) {
		value = instance.currentLeft;
		dom.css(instance.barX, 'left', value / instance.railXRatio);
		dom.css(instance.barXRail, 'left', value);
		if (instance.barYActive) {
			dom.css(instance.barYRail, 'right', -value);
		}
	}
};