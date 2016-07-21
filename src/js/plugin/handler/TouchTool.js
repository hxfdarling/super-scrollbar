/**
 * Created by hxfda on 2016/4/27.
 */
(function (global, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ? factory(global, true) : function (w) {
			if (!w.document) {
				throw new Error("Scroll requires a window with a document");
			}
			if (!w.jQuery) {
				throw new Error('Scroll requires a window with a Jquery');
			}
			return factory(w);
		};
	} else {
		factory(global);
	}
	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
	'use strict';
	var $ = jQuery;
	var bind = function (fn, scope) {
		return function () {
			fn.apply(scope, arguments);
		}
	};
	var TouchTool = function ($el, options) {
		$.extend(this.options, options);
		this.$el = $el;
		this.init();
	};
	var emptyFn = function () {
	};
	/**
	 *
	 * @param current 当前位置
	 * @param distance 滚动量
	 * @param time 持续时间
	 * @param maxScroll 最大滚动值
	 * @param wrapperSize 可用弹性值
	 * @param deceleration 减速度
	 * @returns {{delta: number, duration: (number|*)}}
	 */
	var momentum = function (current, distance, time, maxScroll, wrapperSize, deceleration) {
		var speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		/*if (destination < maxScroll) {
		 destination = wrapperSize ? maxScroll - ( wrapperSize / 2.5 * ( speed / 8 ) ) : maxScroll;
		 distance = Math.abs(destination - current);
		 duration = distance / speed;
		 } else if (destination > 0) {
		 destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
		 distance = Math.abs(current) + destination;
		 duration = distance / speed;
		 }
		 */
		return {
			delta: Math.round(destination) - current,
			duration: duration
		};
	};
	TouchTool.prototype = {
		options: {
			maxScroll: 300,
			//init once
			wrapperHeight: 20,//弹性值
			wrapperWidth: 20,
			bounce: true,//开启弹性滚动
			directionLockThreshold: 5,//锁定滚动差量
			momentum: true,//开启动量滚动
			freeScroll: false,//自有滚动
			start: emptyFn,
			move: emptyFn,
			end: emptyFn,
			stop: emptyFn,
			getInfo:emptyFn
		},
		init: function () {
			var $el = this.$el;
			var events = {
				start: ['touchstart'],
				move: ['touchmove'],
				end: ['touchend',
					'touchcancel']
			};
			var _this = this;
			$.each(events.start, function (index, event) {
				$el.on(event, bind(_this._touchStart, _this));
			});
			$.each(events.move, function (index, event) {
				$el.on(event, bind(_this._touchMove, _this));
			});
			$.each(events.end, function (index, event) {
				$el.on(event, bind(_this._touchEnd, _this));
			});
		},
		update: function (options) {
			$.extend(this.options, options);
		},
		_distanceX: 0,
		_distanceY: 0,
		_startTime: 0,

		_pointX: 0,
		_pointY: 0,
		_distX: 0,
		_distY: 0,
		_endTime: 0,
		_directionLocked: 0,
		_moving: false,
		_touchStart: function (e) {
			this._moving = false;
			this.options.stop();
			e = e.originalEvent;
			var point = e.touches ? e.touches[0] : e;
			this._distanceX = 0;
			this._distanceY = 0;
			this._startTime = Date.now();
			this._pointX = point.pageX;
			this._pointY = point.pageY;
			this._distX = 0;
			this._distY = 0;
			this._directionLocked = 0;
			this.options.start();
		},
		_touchMove: function (e) {
			e = e.originalEvent;
			var point = e.touches ? e.touches[0] : e,
				options = this.options,
				deltaX = this._pointX - point.pageX,
				deltaY = this._pointY - point.pageY,
				timestamp = Date.now(),
				absDistX, absDistY,
				info=options.getInfo();
			this._pointX = point.pageX;
			this._pointY = point.pageY;

			this._distX += deltaX;
			this._distY += deltaY;
			absDistX = Math.abs(this._distX);
			absDistY = Math.abs(this._distY);

			// We need to move at least 10 pixels for the scrolling to initiate
			if (timestamp - this._endTime > 300 && (absDistX < 10 && absDistY < 10)) {
				return;
			}
			// If you are scrolling in one direction lock the other
			if (!this._directionLocked && !options.freeScroll) {
				if (absDistX > absDistY + options.directionLockThreshold) {
					this._directionLocked = 'h';		// lock horizontally
				} else if (absDistY >= absDistX + options.directionLockThreshold) {
					this._directionLocked = 'v';		// lock vertically
				} else {
					this._directionLocked = 'n';		// no lock
				}
			}
			if (this._directionLocked == 'h') {
				if (info.horizontal !== (deltaX / Math.abs(deltaX))) {
					e.preventDefault();
				} else {
					return;
				}
				deltaY = 0;
			} else if (this._directionLocked == 'v') {
				if (info.vertical !== (deltaY / Math.abs(deltaY))) {
					e.preventDefault();
				} else {
					return;
				}
				deltaX = 0;
			}
			if (deltaX || deltaY) {
				this._distanceX += deltaX;
				this._distanceY += deltaY;
				this._moving = true;
				options.move(deltaX, deltaY);
			}
			/* REPLACE START: _move */
			if (timestamp - this.startTime > 300) {
				this._startTime = timestamp;
				this._distanceX = 0;
				this._distanceY = 0;
			}
			/* REPLACE END: _move */
		},
		_touchEnd: function (e) {
			this._endTime = Date.now();
			var options = this.options,
				scrollInfo = options.getInfo(),
				momentumX,
				momentumY,
				duration = Date.now() - this._startTime,
				distanceX = this._distanceX,
				distanceY = this._distanceY,
				wrapperH = options.bounce ? options.wrapperHeight : 0,
				wrapperW = options.bounce ? options.wrapperWidth : 0,
				time = 0;
			// start momentum animation if needed
			if (options.momentum && duration < 300) {
				console.log(scrollInfo);
				console.log('distanceY:' + distanceY + ":duration:" + duration);
				console.log('distanceX:' + distanceX + ":duration:" + duration);

				momentumX = momentum(scrollInfo.currentScroll.width, distanceX, duration, options.maxScroll, wrapperW, options.deceleration);
				momentumY = momentum(scrollInfo.currentScroll.height, distanceY, duration, options.maxScroll, wrapperH, options.deceleration);
				time = Math.max(momentumX.duration, momentumY.duration);
				options.end({
					duration: time,
					deltaX: momentumX.delta,
					deltaY: momentumY.delta
				});
			} else {
				options.end();
			}
			this._moving = false;
		}
	};

	if (!noGlobal) {
		window.TouchTool = TouchTool;
	} else {
		return TouchTool;
	}
});