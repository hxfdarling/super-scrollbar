'use strict';

var Observer = function () {

};
Observer.prototype = {
	listeners: {},
	on: function (name, fn, scope, single) {
		var lis = this.listeners[name] || [];
		lis.push({
			name: name, fn: fn, scope: scope || this, single: single
		});
		this.listeners[name] = lis;
	},
	fire: function (name) {
		var lis = this.listeners[name] || [];
		for (var i = 0; i < lis.length; i++) {
			lis[i].fn.apply(lis[i].scope, Array.prototype.slice.call(arguments, 1));
			if (lis[i].single) {
				lis.splice(i, 1);
				i--;
			}
		}
	},
	un: function (name, fn, scope) {
		var lis = this.listeners[name] || [];
		if (!fn) {
			this.listeners[name] = [];
		}
		for (var i = 0; i < lis.length; i++) {
			if (fn === lis[i].fn && (scope === lis[i].scope || !scope)) {
				lis.splice(i, 1);
				i--;
			}
		}
	}
};
module.exports = Observer;
