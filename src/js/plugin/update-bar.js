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
module.exports = function(element) {
	var instance = instances.get(element),
		value;
	if (instance.barYActive) {
		value = instance.currentTop;
		dom.css(instance.barY, 'top', value / instance.railYRatio);

	}

	if (instance.barXActive) {
		value = instance.currentLeft;
		dom.css(instance.barX, 'left', value / instance.railXRatio);

	}
	/*更新rail位置*/
	if (!instance.config.wrapElement) {
		if (instance.barYActive) {
			dom.css(instance.barYRail, 'top', instance.currentTop);
			dom.css(instance.barYRail, 'right', -instance.currentLeft);
		}
		if (instance.barXActive) {
			dom.css(instance.barXRail, 'left', instance.currentLeft);
			dom.css(instance.barXRail, 'bottom', -instance.currentTop);
		}
	}
};