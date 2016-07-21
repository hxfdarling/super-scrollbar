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
			fn.apply(scope, arguments);
		}
	};
	var $ = window.jQuery;
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

	function ZAnimate($el, property, callback, duration, timing) {
		if (!$el.length) {
			throw 'jQuery object is undefined';
		}
		this.__target = $el;
		this.init(callback, duration, timing);
		this.run(property);
	}

	ZAnimate.prototype = {
		__duration: 200,
		__stoped: false,
		__doing: false,
		__target: null,
		__frames: {},
		__callback: null,
		/**
		 * quadratic,bounce,easing,back,circular,elastic,smooth
		 */
		__timing: 'easing',
		init: function (callback, duration, timing) {
			!isNaN(parseFloat(duration)) && (this.__duration = parseFloat(duration));
			this.__callback = callback;
			this.__timing = timing || this.__timing;
		},
		callback: function () {
			this.__doing = false;
			this.__frames = {};
			this.__callback && this.__callback();
			this.trigger('zAnimateEnd');
		},
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
		},
		step: function (timestamp) {
			if (!this.__target.parent().length) {//dom is destroyed
				this.stop();
			}
			if (this.__stoped) {
				return
			}
			this.__doing = true;
			var hasFrame = 0;
			var now = Date.now();
			var duration = this.__duration;
			var delta, item, finished, elapsed, position, que, total;
			var current;
			for (var key in this.__frames) {
				if (!this.__frames.hasOwnProperty(key)) {
					return;
				}
				hasFrame++;
				que = this.__frames[key];
				total = 0;
				for (var i = 0; i < que.length; i++) {
					item = que[i];
					elapsed = now - item.start;
					finished = (elapsed >= duration);

					// scroll position: [0, 1]
					if (typeof this.__timing == 'function') {
						position = this.__timing((finished) ? 1 : elapsed / duration);
					} else {
						position = timing[this.__timing]((finished) ? 1 : elapsed / duration);
					}


					// only need the difference
					delta = (item.delta * position - item.last) >> 0;

					// add this to the total
					total += delta;

					// update last values
					item.last += delta;

					// delete and step back if it's over
					if (finished) {
						que.splice(i, 1);
						i--;
					}
				}

				if (window.devicePixelRatio) {
					//scrollX /= (window.devicePixelRatio;
					//scrollY /= window.devicePixelRatio;
				}
				switch (key) {
					case  'scrollLeft':
						this.__target[0].scrollLeft += total;
						current = this.__target[0].scrollLeft;
						break;
					case 'scrollTop':
						this.__target[0].scrollTop += total;
						current = this.__target[0].scrollTop;
						break;
					default:
						this.__target.css(key, parseInt(this.__target.css(key)) + total);
						current = parseInt(this.__target.css('key'));
						break;
				}
				if (!que.length) {
					delete this.__frames[key];
					hasFrame--;
				}
				this.trigger('zAnimating', key, current);
			}
			if (hasFrame) {
				requestAnimationFrameHelper.call(window, bind(this.step, this));
			} else {
				this.callback();
			}

		},
		pushFrame: function (property) {
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
					switch (key) {
						case 'scrollTop':
							value.from = this.__target.scrollTop();
							break;
						case 'scrollLeft':
							value.from = this.__target.scrollLeft();
							break;
						default :
							value.from = parseInt(this.__target.css(key));
							break;
					}
				}
				if (value.to === 'auto') {
					this.__target.css(key, 'auto');
					value.to = parseInt(this.__target.css(key));
					this.__target.css(key, value.from);
				}
				if (value.from !== undefined && value.to !== undefined) {
					value.delta = value.to - value.from;
				}
				if (value.delta) {
					value.last = (value.delta < 0) ? 0.99 : -0.99;
					value.start = now;
					this.__frames[key].push(value);
				}
			}
		},
		update: function (callback, duration, timing) {
			this.init(callback, duration, timing);
		},
		/**
		 * 添加更多的动画关键帧,一个dom只需要一个animate对象，所有动画都 又这个对象处理
		 * @param property
		 */
		run: function (property) {
			if (property) {
				this.pushFrame(property);
				if (!this.isDoing()) {
					this.start();
				}
			}
		},
		start: function () {
			this.__stoped = false;
			this.__doing = false;
			this.trigger('zAnimateStart');
			requestAnimationFrameHelper.call(window, bind(this.step, this));
		},
		isDoing: function () {
			return this.__doing;
		},
		stop: function () {
			if (this.isDoing()) {
				this.__stoped = true;
				this.trigger('zAnimateStop');
				this.callback();
			}
			return this;
		}
	};

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