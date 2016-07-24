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
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (value) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === value) {
				return i;
			}
		}
		return -1;
	}
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function (fn) {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			if (fn(this[i])) {
				result.push(this[i]);
			}
		}
		return result;
	}
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (fn) {
		for (var i = 0; i < this.length; i++) {
			fn(this[i]);
		}
	}
}