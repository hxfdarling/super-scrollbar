/**
 * Created by z-man on 2016/7/21.
 * @class native-scroll
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var updateBar = require('../update-bar');
var update = require('../update');
function bindNativeScroll(element) {
	var instance = instances.get(element);
	instance.event.on(element, 'scroll', function () {
		if(instance.config.autoUpdate) {
			update(element);
		}
		if (instance.animate.isDoing()) {
			return;
		}
		if (instance.currentLeft !== element.scrollLeft || instance.currentTop !== element.scrollTop) {
			instance.currentLeft = instance.getTrueLeft(element.scrollLeft);
			instance.currentTop = instance.getTrueTop(element.scrollTop);
			updateBar(element);
		}

	});
}
module.exports = function (element) {
	bindNativeScroll(element);
};