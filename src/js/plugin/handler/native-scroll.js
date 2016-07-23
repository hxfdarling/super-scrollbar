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
var $ = require('../../lib/jquery-bridge');

function bindNativeScroll(element) {
	var $element = $(element);
	var instance = instances.get(element);
	$element.on('scroll', function () {
		if (instance.animate.isDoing()) {
			return;
		}
		if (instance.currentLeft !== element.scrollLeft || instance.currentTop !== element.scrollTop) {
			instance.currentLeft = element.scrollLeft;
			instance.currentTop = element.scrollTop;
			updateBar(element);
		}

	});
}
module.exports = function (element) {
	bindNativeScroll(element);
};