/**
 * Created by z-man on 2016/7/21.
 * @class initialize
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
// Handlers
require('../lib/fixed');
var handlers = {
	'click-rail': require('./handler/click-rail'),
	'drag-bar': require('./handler/drag-bar'),
	'keyboard': require('./handler/keyboard'),
	'wheel': require('./handler/mouse-wheel'),
	'touch': require('./handler/touch'),
	'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');
var instances = require('./instances');
var update = require('./update');
var updateScroll = require('./update-scroll');
var config = require('./config');
var dom = require('../lib/dom');
var helper = require('../lib/helper');
module.exports = function (element, cfg) {
	cfg = typeof cfg === 'object' ? cfg : {};
	if (instances.get(element)) {
		return;
	}
	var instance = instances.add(element, helper.apply(config, cfg));
	instance.config.handlers.forEach(function (handlerName) {
		handlers[handlerName](element);
	});

	nativeScrollHandler(element);

	instance.animate.stepCallback = function (key, value) {
		switch (key) {
			case 'top':
				updateScroll(element, key, instance.currentTop + value);
				break;
			case 'left':
				updateScroll(element, key, instance.currentLeft + value);
				break;
		}
	};
	update(element);
};