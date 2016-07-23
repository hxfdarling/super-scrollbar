/**
 * Created by z-man on 2016/7/21.
 * @class keyboard
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var update = require('../update');
var helper = require('../../lib/helper');
var $ = require('../../lib/jquery-bridge');

function bindKeyBoard(element) {
	var instance = instances.get(element);
	var key = {
		left: 37, up: 38, right: 39, down: 40, spacebar: 32,
		pageup: 33, pagedown: 34, end: 35, home: 36
	};

	$(element).attr('tabIndex',0)
		.on('keydown', function (event) {
		if (helper.isEditable(event.target)) {
			return;
		}
		var keyScrollIncrement = instance.config.keyScrollIncrement;
		var deltaX = 0, deltaY = 0;
		switch (event.keyCode) {
			case key.left:
				deltaX = -keyScrollIncrement;
				break;
			case key.right:
				deltaX = keyScrollIncrement;
				break;
			case key.up:
				deltaY = -keyScrollIncrement;
				break;
			case key.down:
				deltaY = keyScrollIncrement;
				break;
			case key.spacebar:
				deltaY = keyScrollIncrement * 2;
				break;
			case key.pageup:
				deltaY = -keyScrollIncrement * 3;
				break;
			case key.pagedown:
				deltaY = keyScrollIncrement * 3;
				break;
			case key.end:
				deltaY = -instance.currentTop + instance.contentHeight;
				break;
			case key.home:
				deltaY = -instance.currentTop;
				break;
		}
		instance.animate.run({
			top: {delta: deltaY},
			left: {delta: deltaX}
		});
	});
}
module.exports = function (element) {
	bindKeyBoard(element);
};