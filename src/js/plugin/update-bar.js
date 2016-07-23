/**
 * Created by z-man on 2016/7/21.
 * @class update-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('./instances');
module.exports = function (element) {
	var instance = instances.get(element), value;
	if (instance.barYActive) {
		value = instance.currentTop;
		instance.barY.css('top', value / instance.railYRatio);
		if (instance.barXActive) {
			instance.barYRail.css('top', value);
			instance.barXRail.css('bottom', -value);
		}
	}

	if (instance.barXActive) {
		value = instance.currentLeft;
		instance.barX.css('left', value / instance.railXRatio);
		if (instance.barYActive) {
			instance.barXRail.css('left', value);
			instance.barYRail.css('right', -value);
		}
	}
};