/**
 * Created by z-man on 2016/7/21.
 * @class fixed
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function (scope) {
		var fn = this;
		return function () {
			fn.apply(scope, arguments);
		}
	};
}
if (!String.prototype.format) {
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function (m, i) {
			return args[i];
		});
	};
}
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
}