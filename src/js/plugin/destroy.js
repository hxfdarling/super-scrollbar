/**
 * Created by z-man on 2016/7/21.
 * @class destroy
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('./instances');

module.exports = function (element) {
	var i = instances.get(element);

	if (!i) {
		return;
	}
	instances.remove(element);
};
