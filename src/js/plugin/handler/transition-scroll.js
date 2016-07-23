/**
 * Created by z-man on 2016/7/23.
 * @class transition-scroll
 * @author z-man
 * @date 2016/7/23
 * @description 描述该类...
 */
'use strict';
var instances = require('../instances');
var updateBar = require('../update-bar');
var $ = require('../../lib/jquery-bridge');
function bindScroll(element) {
	var $element = $(element);
	var instance = instances.get(element);

}
module.exports = function (element) {
	bindScroll(element);
};