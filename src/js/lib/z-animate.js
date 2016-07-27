/**
 * @author zman
 * @date 2016-4-25
 */
(function (global, undefined) {
	'use strict';
	/*
	 * https://github.com/oblador/angular-scroll (duScrollDefaultEasing)
	 * 0-1
	 */
	var timing = {
		quadratic: function (k) {
			return k * ( 2 - k );
		},
		circular: function (k) {
			return Math.sqrt(1 - ( --k * k ));
		},
		back: function (k) {
			var b = 4;
			return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
		},
		bounce: function (k) {
			if (( k /= 1 ) < ( 1 / 2.75 )) {
				return 7.5625 * k * k;
			} else if (k < ( 2 / 2.75 )) {
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
			} else if (k < ( 2.5 / 2.75 )) {
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
			} else {
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
			}
		},
		elastic: function (k) {
			var f = 0.22,
				e = 0.4;

			if (k === 0) {
				return 0;
			}
			if (k == 1) {
				return 1;
			}
			return ( e * Math.pow(2, -10 * k) * Math.sin(( k - f / 4 ) * ( 2 * Math.PI ) / f) + 1 );

		},
		easing: function (x) {
			if (x < 0.5) {
				return Math.pow(x * 2, 2) / 2;
			}
			return 1 - Math.pow((1 - x) * 2, 2) / 2;
		},
		smooth: function (x) {
			return x;
		}
	};

	var bind = function (fn, scope) {
		return function () {
			fn(scope);
		}
	};
	/*
	 * Wraps window properties to allow server side rendering
	 */
	var currentWindowProperties = function () {
		if (typeof window !== 'undefined') {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
		}
	};

	/*
	 * Helper function to never extend 60fps on the webpage.
	 */
	var requestAnimationFrameHelper = (function () {
		return currentWindowProperties() ||
			function (callback, element, delay) {
				return window.setTimeout(callback, delay || (1000 / 60), Date.now());
			};
	})();
	var helper = require('./helper');

	/**
	 *
	 * @param config:[property:[key,value],  duration, timing]
	 * @constructor
	 */
	function ZAnimate(config) {
		helper.apply(this, config);
	}

	ZAnimate.prototype = {
		duration: 200,
		/**
		 * quadratic,bounce,easing,back,circular,elastic,smooth
		 */
		timing: 'easing',
		__stoped: false,
		__doing: false,
		__frames: {}
	};
	helper.apply(ZAnimate.prototype, {
		_stepEnd: function () {
			this.__doing = false;
			this.__frames = {};
			this.trigger('zAnimateEnd');
		},
		_pushFrame: function (property) {
			if (!property)return;
			var now = Date.now(), value;
			for (var key in property) {
				if (!property.hasOwnProperty(key)) {
					return;
				}
				if (!this.__frames[key]) {
					this.__frames[key] = [];
				}
				value = property[key];
				if (value.from === undefined) {
					value.from = 0;
				}
				if (value.to === undefined) {
					value.to = 0;
				}
				if (!value.delta) {
					value.delta = value.to - value.from;
				}
				if (value.delta) {
					value.last = (value.delta < 0) ? 0.99 : -0.99;
					value.start = now;
					this.__frames[key].push(value);
				}
			}
		},
		_step: function (that) {
			that.beforeStep();
			if (that.__stoped) {
				return
			}
			that.__doing = true;
			var hasFrame = 0;
			var now = Date.now();
			var duration = that.duration;
			var delta, item, finished, elapsed, position, que, total;
			for (var key in that.__frames) {
				if (!that.__frames.hasOwnProperty(key)) {
					return;
				}
				hasFrame++;
				que = that.__frames[key];
				total = 0;
				for (var i = 0; i < que.length; i++) {
					item = que[i];
					elapsed = now - item.start;
					finished = (elapsed >= duration);

					// scroll position: [0, 1]
					if (typeof that.timing == 'function') {
						position = that.timing((finished) ? 1 : elapsed / duration);
					} else {
						position = timing[that.timing]((finished) ? 1 : elapsed / duration);
					}


					// only need the difference
					delta = (item.delta * position - item.last) >> 0;

					// add that to the total
					total += delta;

					// update last values
					item.last += delta;

					// delete and step back if it's over
					if (finished) {
						que.splice(i, 1);
						i--;
					}
				}

				that.stepCallback(key, total);
				if (!que.length) {
					delete that.__frames[key];
					hasFrame--;
				}
			}
			if (hasFrame) {
				requestAnimationFrameHelper.call(window, bind(that._step, that));
			} else {
				that._stepEnd();
			}

		}
	});
	helper.apply(ZAnimate.prototype, {
		beforeStep: function () {
			//检查当前动画是否能够继续执行，比如element被删除会导致执行失败，需要终止动画继续执行
			//this.stop();
		},
		stepCallback: function (key, total) {
			this.trigger('zAnimating', key, total);
		},
		/**
		 * 添加更多的动画关键帧,一个dom只需要一个animate对象，所有动画都 又这个对象处理
		 * @param property
		 */
		run: function (property) {
			if (property) {
				this._pushFrame(property);
				if (!this.isDoing()) {
					this.start();
				}
			}
		},
		start: function () {
			this.__stoped = false;
			this.__doing = false;
			this.trigger('zAnimateStart');
			requestAnimationFrameHelper.call(window, bind(this._step, this));
		},
		isDoing: function () {
			return this.__doing;
		},
		stop: function () {
			if (this.isDoing()) {
				this.__stoped = true;
				this.trigger('zAnimateStop');
				this._stepEnd();
			}
			return this;
		}
	});
	helper.apply(ZAnimate.prototype, {
		__listeners: {},
		on: function (name, fn, scope, once) {
			var listener = this.__listeners[name] || [];
			listener.push({
				name: name,
				fn: fn,
				once: once,
				scope: scope || this
			});
			this.__listeners[name] = listener;
		},
		off: function (name, fn, scope) {
			var listeners = this.__listeners[name] || [], listener;
			if (fn === undefined && scope === undefined) {
				delete this.__listeners[name];
				return;
			}
			for (var i = 0; i < listeners.length; i++) {
				listener = listeners[i];
				if (fn === listener.fn && (scope === undefined || scope === listener.scope)) {
					listeners.splice(i, 1);
					i--;
				}
			}
		},
		once: function (name, fn, scope) {
			this.on(name, fn, scope, 'true');
		},
		trigger: function (name) {
			var args = Array.prototype.slice.call(arguments, 1);
			var listeners = this.__listeners[name] || [], listener;
			for (var i = 0; i < listeners.length; i++) {
				listener = listeners[i];
				listener.fn.apply(listener.scope, args);
				if (listener.once) {
					listeners.splice(i, 1);
					i--;
				}
			}
		}
	});

	if (typeof module != 'undefined' && module.exports) {
		module.exports = ZAnimate;
	} else if (typeof define == 'function' && define.amd) {
		define(function () {
			return ZAnimate;
		});
	} else {
		window.ZAnimate = ZAnimate;
	}
})(window, undefined);