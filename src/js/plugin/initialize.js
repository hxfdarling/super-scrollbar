/**
 * Created by z-man on 2016/7/21.
 * @class initialize
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
// Handlers
var handlers = {
	'click-bar': require('./handler/click-bar'),
	'drag-bar': require('./handler/drag-bar'),
	'keyboard': require('./handler/keyboard'),
	'wheel': require('./handler/mouse-wheel'),
	'touch': require('./handler/touch'),
	'selection': require('./handler/selection')
};
var util = require('../lib/util');
var nativeScrollHandler = require('./handler/native-scroll');
var instances = require('./instances');
var update = require('./update');
var $ = require('../lib/dom');
module.exports = function (element, config) {
	config = typeof config === 'object' ? config : {};

	var instance = instances.add(element);

	instance.config = util.apply(instance.config, config);

	instance.config.handlers.forEach(function (handlerName) {
		handlers[handlerName](element);
	});
	nativeScrollHandler(element);
	$(element).addClass('ss-container super-scrollbar');
	if (instance.config.autoHideBar) {
		$(element).addClass('ss-auto-hide');
	}
	update(element);
};
