(function () {
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
})();
(function (global) {
	'use strict';

	var $ = global.jQuery,
		key = {
			left: 37, up: 38, right: 39, down: 40, spacebar: 32,
			pageup: 33, pagedown: 34, end: 35, home: 36
		},
		defaultOptions = {
			model: 'position',//scroll,position,translate
			/**
			 *  scrollbar min size (height or width)
			 */
			minSize: 50,
			/*
			 scrollbar axis (v and/or h scrollbars)
			 values (string): "y", "x", "yx",'auto'
			 */
			axis: 'auto',
			scrollIncrement: 120,
			/*
			 position of scrollbar relative to content
			 values (string): "inside", "outside" (requires elements with not position:static)
			 */
			scrollbarPosition: "inside",
			autoHideScrollbar: true,
			/*
			 mouse-wheel scrolling
			 */
			mouseWheel: {
				/*
				 enable mouse-wheel scrolling
				 values: boolean
				 */
				enable: true,
				axis: "y",
				/*
				 normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration)
				 values: boolean
				 option						default
				 -------------------------------------
				 normalizeDelta				null
				 */
				/*
				 invert mouse-wheel scrolling direction
				 values: boolean
				 option						default
				 -------------------------------------
				 invert						null
				 */
				/*
				 the tags that disable mouse-wheel when cursor is over them
				 */
				disableOver: ["select", "option", "keygen", "datalist", "textarea"]
			},
			/*
			 keyboard scrolling
			 */
			keyboard: {
				enable: true,
				disableOver: ["select", "option", "keygen", "datalist", "textarea"]
			},
			touch: {
				enable: false
			}
		};
	var ZScroll = function ($el, options) {
		this.$el = $el;
		this.idx = ++ZScroll.idx;
		this.options = $.extend(true, {}, defaultOptions, options);
		this.__info = {
			directionX: 0,
			directionY: 0,

			drag: false,
			vertical: -1,//-1顶部,1底部,0中间
			horizontal: -1,//-1左边，1右边，0中间
			size: {
				width: 0,
				height: 0
			},
			maxScroll: {
				x: 0,
				y: 0
			},
			currentScroll: {
				x: 0,
				y: 0
			},
			endScroll: {
				x: 0,
				y: 0
			}
		};
		$el.data('zscroll', this);
	};
	ZScroll.idx = 0;
	ZScroll.prototype = {
		init: function () {
			if (this.initialized) {/* check if plugin has initialized */
				this.update();
				return;
			}
			var opt = this.options,
				$el = this.$el;
			if (opt.axis === 'auto') {
				opt.axis = '';
				if (/auto|scroll/.test($el.css('overflowX'))) {
					opt.axis += 'x';
				}
				if (/auto|scroll/.test($el.css('overflowY'))) {
					opt.axis += 'y';
				}
			}
			if (!opt.axis) { //not axis
				return;
			}
			this.initialized = true;
			this.render();

			this.initEvent();

			this.update();
		},
		render: function () {
			var scrollBox,//滚动盒子
				scrollContainer,//滚动内容
				scrollBars = [],
				opt = this.options,
				$el = this.$el;
			$el.addClass('zscroll')
				.wrapInner('<div id="zscroll_' + this.idx + '_container" class="zscroll-container"></div>')
				.wrapInner('<div tabindex=0 id="zscroll_' + this.idx + '_box" class="zscroll-box"></div>');
			scrollBox = $("#zscroll_" + this.idx + '_box');
			scrollContainer = $("#zscroll_" + this.idx + "_container");
			if (~opt.axis.indexOf('x')) {
				scrollBars[0] = $('<div  tabindex=0 id="zscroll_' + this.idx + '_scroll_h" class="zscroll-bar zscroll-bar-h"></div>');
				scrollBars[0].append($('<div class="zscroll-dragger-container"><div class="zscroll-draggerRail"></div><div class="zscroll-dragger"><div class="zscroll-dragger-bar"></div></div></div>'));
			}
			if (~opt.axis.indexOf('y')) {
				scrollBars[1] = $('<div  tabindex=0 id="zscroll_' + this.idx + '_scroll_v" class="zscroll-bar zscroll-bar-v"></div>');
				scrollBars[1].append($('<div class="zscroll-dragger-container"><div class="zscroll-draggerRail"></div><div class="zscroll-dragger"><div class="zscroll-dragger-bar"></div></div></div>'));
			}
			switch (opt.scrollbarPosition) {
				case 'inside':
				case 'outside':
					scrollBars[0] && $el.append(scrollBars[0]);
					scrollBars[1] && $el.append(scrollBars[1]);
					if ($el.css("position") === "static") { /* requires elements with non-static position */
						$el.css("position", "relative");
					}
					break;
			}
			if (opt.autoHideScrollbar) {
				$el.addClass('zscroll-auto-hide')
			} else {
				$el.removeClass('zscroll-auto-hide');
			}
			this.scrollBars = scrollBars;
			this.scrollBox = scrollBox;
			this.scrollContainer = scrollContainer;
		},
		initEvent: function () {
			var scrollBox = this.scrollBox,
				scrollBars = this.scrollBars;
			this.mouseWheel();
			this.keydown();
			this.touch();
			var _this = this, over = false;
			this.$el.on('mouseover', function () {
				over = true;
				_this.$el.trigger('over');
			});
			this.$el.on('mouseout', function () {
				over = false;
				_this.$el.trigger('out');
			});

			$(document).on('mousemove', function (event) {
				if (!_this.dragStatus) {
					return;
				}
				var bar = _this.scrollBars[_this.dragStatus == 'x' ? 0 : 1],
					n_xy = [event.pageX, event.pageY], o_xy = _this._xy, delta;
				if (!bar || !o_xy) {
					return;
				}
				event.preventDefault();
				_this._xy = n_xy;
				switch (_this.dragStatus) {
					case 'x':
						delta = (n_xy[0] - o_xy[0]);
						if (delta) {
							delta = delta / _this.w_ratio;
							_this.scrollX(delta, true);
						}
						break;
					case 'y':
						delta = (n_xy[1] - o_xy[1]);
						if (delta) {
							delta = delta / _this.h_ratio;
							_this.scrollY(delta, true);
						}
						break;
				}

			});
			$(document).on('mouseup', function (event) {
				if (_this.dragStatus) {
					var bar = _this.scrollBars[_this.dragStatus == 'x' ? 0 : 1];
					bar.removeClass('mouse-down');
					$('body').removeClass('scrolling');

					_this._xy = [event.pageX, event.pageY];
					_this.dragStatus = false;
				}

				if ($(event.target).parents('.zscroll').length == 0) {
					_this.$el.trigger('out');
				}
			});


			//--------------
			this.zAnimate = new ZAnimate(scrollBox);
			//-------处理在触屏模式下没有over事件
			this.zAnimate.on('zAnimateEnd', function () {
				if (!over) {
					this.$el.trigger('out');
				}
				this.updateCurrentInfo();
			}, this);
			this.zAnimate.on('zAnimateStop', function () {//中途停止滚动，需要重置currentScroll
				_this.__info.currentScroll = _this.__info.endScroll;
			}, this);
			this.zAnimate.on('zAnimating', function (key, current) {
				switch (key) {
					case 'top':
					case 'translateY':
					case 'scrollTop':
						this.__info.endScroll.y = current;
						!_this.dragStatus && this.scrollYBar(current);
						break;
					case 'left':
					case 'translateX':
					case 'scrollLeft':
						this.__info.endScroll.x = current;
						!_this.dragStatus && this.scrollXBar(current);
						break;
				}
			}, this);
			this.zAnimate.on('zAnimateStart', function () {
				_this.$el.trigger('over');
			});

			//-------
			if (scrollBars[0]) {
				scrollBars[0].data('axis', 'x');
				this.initBarEvent(scrollBars[0]);
			}
			if (scrollBars[1]) {
				scrollBars[1].data('axis', 'y');
				this.initBarEvent(scrollBars[1]);
			}
			//-----ui--------------
			this.$el.on('over', function () {
				_this.$el.addClass('mouse-over');
			});
			this.$el.on('out', function () {
				!_this.dragStatus && _this.$el.removeClass('mouse-over');
			});
		},
		initBarEvent: function (bar) {
			if (!bar) {
				return;
			}
			var _this = this;

			bar.on('click', function (event) { //点击滚动槽，移动滚动条
				if (!/zscroll-draggerRail/.test(event.target.className)) {
					return;
				}
				var distance, dragger;
				switch (bar.data('axis')) {
					case 'x':
						dragger = bar.find('.zscroll-dragger');
						distance = event.offsetX -
							( dragger.offset().left - dragger.offsetParent().offset().left)
							- dragger.width() / 2;
						_this.scrollBy(distance / _this.w_ratio, 0, undefined, true);
						break;
					case 'y':
						dragger = bar.find('.zscroll-dragger');
						distance = event.offsetY -
							( dragger.offset().top - dragger.offsetParent().offset().top)
							- dragger.height() / 2;
						_this.scrollBy(0, distance / _this.h_ratio, undefined, true);
						break;
				}
			});
			bar.on('mousedown', function (event) {
				_this.$el.trigger('over');
				if (/zscroll-dragger-bar/.test(event.target.className)) { //拖动滚动条
					_this._xy = [event.pageX, event.pageY];
					_this.dragStatus = bar.data('axis');

					bar.addClass('mouse-down');
					$('body').addClass('scrolling');
				}
			});

		},
		/**
		 * 支持触摸屏设备
		 */
		touch: function () {
			if (!this.options.touch.enable) {
				return;
			}
			var _this = this;
			new TouchTool(this.$el, {
				getInfo: function () {
					return _this.__info;
				},
				stop: function () {
					_this.zAnimate.stop();
				},
				start: function () {
					_this.$el.trigger('over');
				},
				move: function (deltaX, deltaY) {
					_this.scrollBy(deltaX, deltaY, undefined, {name: 'smooth', duration: 100});
				},
				end: function (animate) {
					if (animate) {
						_this.scrollBy(animate.deltaX, animate.deltaY, undefined, {
							name: 'quadratic',
							duration: animate.duration
						});
					} else {
						_this.$el.trigger('out');
					}
				}
			});
		},
		keydown: function () {
			var _this = this;
			this.options.keyboard.enable && this.$el.on('keydown', function (event) {
				if ($(event.target).is(_this.options.keyboard.disableOver.join(','))) {
					return;
				}
				var scrollIncrement = _this.options.scrollIncrement;
				var deltaX = 0, deltaY = 0;
				switch (event.keyCode) {
					case key.left:
						deltaX = -scrollIncrement;
						break;
					case key.right:
						deltaX = scrollIncrement;
						break;
					case key.up:
						deltaY = -scrollIncrement;
						break;
					case key.down:
						deltaY = scrollIncrement;
						break;
					case key.spacebar:
						deltaY = scrollIncrement * 2;
						break;
					case key.pageup:
						deltaY = -scrollIncrement * 3;
						break;
					case key.pagedown:
						deltaY = scrollIncrement * 3;
						break;
					case key.end:
						deltaY = -_this.__info.currentScroll.y + _this.__info.size.height;
						break;
					case key.home:
						deltaY = -_this.__info.currentScroll.y;
						break;
				}
				_this.scrollBy(deltaX, deltaY, event, true);
			});
		},
		mouseWheel: function () {
			var mouseWheel = this.options.mouseWheel;
			var _this = this,
				scrollIncrement = _this.options.scrollIncrement,
				isReallyValue = false;
			if (/WebKit/.test(navigator.userAgent)) {
				isReallyValue = true;
			}
			if (mouseWheel.enable) {
				var wheel = /MSIE 8.0/.test(navigator.userAgent) ? 'mousewheel' : 'wheel';
				this.$el.on(wheel, function (event) {
					if ($(event.target).is(mouseWheel.disableOver.join(','))) {
						return;
					}
					var deltaY = event.originalEvent.deltaY || -event.originalEvent.wheelDelta,
						deltaX = event.originalEvent.deltaX;
					if (event.ctrlKey || event.altKey) {
						return;
					}
					if (deltaY && /y/.test(_this.options.axis)) { //if wheel is y
						deltaY = isReallyValue ? deltaY : deltaY / Math.abs(deltaY) * scrollIncrement;
						//options is x or shiftKey is down to scroll x
						if ((mouseWheel.axis === 'x' && !event.shiftKey) || event.shiftKey) {
							_this.scrollBy(deltaY, 0, event, true);
						} else {
							_this.scrollBy(0, deltaY, event, true);
						}
					} else if (deltaX) {// if wheel is x
						_this.scrollBy(isReallyValue ? deltaX : deltaX / Math.abs(deltaX) * scrollIncrement, 0, event, true);
					}
				});
			}
		},
		updateCurrentInfo: function () {
			var __info = this.__info;
			if (__info.currentScroll.y === __info.maxScroll.y) {
				__info.vertical = 1;
			} else if (__info.currentScroll.y === 0) {
				__info.vertical = -1;
			} else {
				__info.vertical = 0;
			}
			if (__info.currentScroll.x === __info.maxScroll.x) {
				__info.horizontal = 1;
			} else if (__info.currentScroll.x === 0) {
				__info.horizontal = -1;
			} else {
				__info.horizontal = 0;
			}
		},
		/**
		 * 垂直移动
		 * @param delta
		 * @param animate 是否是拖拽移动
		 * @returns {boolean}
		 */
		scrollY: function (delta, animate) {
			if (!delta) {
				return true
			}
			this.updateCurrentInfo();
			var currentHeight = this.__info.currentScroll.y;
			var distance = currentHeight + delta;
			distance = Math.max(distance, 0);
			distance = Math.min(distance, this.__info.maxScroll.y) >> 0;
			if (this.dragStatus === 'y') {
				this.scrollYBar(distance);
			}
			delta = distance - currentHeight;//get relay delta
			this.__info.currentScroll.y = distance;
			if (!animate) {//drag status not smooth scroll
				switch (this.options.model) {
					case 'position':
						this.scrollBox.css('top', distance);
						break;
					case 'translate':
						this.scrollBox.css('transition', 'translateY({0})'.format(distance));
						break;
					case 'scroll':
						this.scrollBox.scrollTop(distance);
						break;
				}

			} else {
				this.updateAnimate(animate);
				this.zAnimate.run({scrollTop: {delta: delta}});
			}

			this.$el.trigger('scrollY');

			return true;
		},
		/**
		 * 横向移动
		 * @param delta
		 * @param animate 是否是拖拽移动
		 * @returns {boolean} 是否移动到末端了
		 */
		scrollX: function (delta, animate) {
			if (!delta) {
				return true
			}

			this.updateCurrentInfo();
			var currentWidth = this.__info.currentScroll.x;
			var distance = currentWidth + delta;
			distance = Math.max(distance, 0);
			distance = Math.min(distance, this.__info.maxScroll.x) >> 0;
			if (this.dragStatus === 'x') {
				this.scrollXBar(distance);
			}
			delta = distance - currentWidth;
			this.__info.currentScroll.x = distance;
			if (!animate) {
				this.scrollBox.scrollLeft(distance);
			} else {
				this.updateAnimate(animate);
				this.zAnimate.run({scrollLeft: {delta: delta}});
			}

			this.$el.trigger('scrollX');
			return true;

		},
		updateAnimate: function (animate) {
			var time = 200;
			if (animate === true) {
				animate = 'easing';
			}
			if (typeof animate === 'object') {
				time = animate.duration;
				animate = animate.name;
			}
			this.zAnimate.update(undefined, time, animate);
		},
		scrollBy: function (deltaX, deltaY, event, animate) {
			this.scrollBars[0] && this.scrollX(deltaX, animate);
			this.scrollBars[1] && this.scrollY(deltaY, animate);
			if (deltaX && deltaX * this.__info.horizontal <= 0) {
				event && event.preventDefault();
			}
			if (deltaY && deltaY * this.__info.vertical <= 0) {
				event && event.preventDefault();
			}
		},
		scrollTo: function (x, y) {
			var curentScroll = this.__info.currentScroll;
			this.scrollBy(x - curentScroll.x, y - curentScroll.y, undefined, true);
		},
		scrollXBar: function (distance) {
			var dragger = this.scrollBars[0].find('.zscroll-dragger');
			dragger.css('left', this.w_ratio * distance);
		},
		scrollYBar: function (distance) {
			var dragger = this.scrollBars[1].find('.zscroll-dragger');
			dragger.css('top', this.h_ratio * distance);
		},

		update: function () {
			var sBox = this.scrollBox,//滚动盒子
				c_width, c_height, b_width, b_height, offset,
				options = this.options, __info = this.__info,
				barX = this.scrollBars[0], barY = this.scrollBars[1];

			sBox.css({"max-height": this.$el.height(), 'max-width': this.$el.width()});
			c_width = this.scrollContainer.width();
			c_height = this.scrollContainer.height();
			b_width = sBox.width();
			b_height = sBox.height();

			__info.size = {width: c_width, height: c_height};
			__info.maxScroll = {y: c_height - b_height, x: c_width - b_width};
			if (barX) {
				offset = 0;
				if (barY && !barY.hasClass('hide') && options.scrollbarPosition === 'inside') {
					//has v bar need offset
					offset = barY.find('.zscroll-dragger-container').width(); //横向滚动条高度作为偏移量
				}
				barX.width('');
				var w_ratio = b_width / c_width;
				var barWidth = barX.width() - offset;//bar width
				var dragWidth = Math.max(w_ratio * barWidth, options.minSize);// dragger width
				barX.width(barWidth);
				barX.find('.zscroll-dragger').width(dragWidth);
				if (c_width <= b_width) {//hide the bar
					barX.addClass('hide');
					this.w_ratio = 1;
				} else {
					barX.removeClass('hide');
					this.w_ratio = (barWidth - dragWidth) / (c_width - b_width);
				}
				if (options.scrollbarPosition === 'outside') {
					barX.css('bottom', -barX.find('.zscroll-dragger-container').height());
				}
				this.scrollXBar(__info.currentScroll.x);//restore scroll position
			}
			if (barY) {
				offset = 0;
				if (barX && !barX.hasClass('hide') && options.scrollbarPosition === 'inside') {
					//has h bar need offset
					offset = barX.find('.zscroll-dragger-container').height(); //横向滚动条高度作为偏移量
				}
				var h_ratio = b_height / c_height;
				barY.height('');
				var barHeight = barY.height() - offset; //bar height
				var dragHeight = Math.max(h_ratio * barHeight, options.minSize);//drag height

				barY.height(barHeight || '');
				barY.find('.zscroll-dragger').height(dragHeight);
				if (c_height <= b_height) {//hide the bar
					barY.addClass('hide');
					this.h_ratio = 1;
				} else {
					barY.removeClass('hide');
					this.h_ratio = (barHeight - dragHeight) / (c_height - b_height);
				}
				if (options.scrollbarPosition === 'outside') {
					barY.css('right', -barY.find('.zscroll-dragger-container').width());
				}
				this.scrollYBar(__info.currentScroll.y);//restore scroll position
			}
		},
		sync: function () {
			this.__info.currentScroll.y = this.scrollBox.scrollTop();
			this.__info.currentScroll.x = this.scrollBox.scrollLeft();
			this.scrollYBar(this.__info.currentScroll.y);//restore scroll position
			this.scrollXBar(this.__info.currentScroll.x);//restore scroll position
		}
	};
	var apply = function (dest, src, defaults) {
		if (defaults) {
			apply(dest, defaults);
		}

		if (dest && src && typeof src == 'object') {
			for (var key in src) {
				dest[key] = src[key];
			}
		}
		return dest;
	};
	apply(ZScroll.prototype, {
		__listeners: {},
		on: function (name, fn, scope, single) {
			var lis = this.__listeners[name] || [];
			lis.push({
				name: name, fn: fn, scope: scope || this, single: single
			});
			this.__listeners[name] = lis;
		},
		fire: function (name) {
			var lis = this.__listeners[name] || [];
			for (var i = 0; i < lis.length; i++) {
				lis[i].fn.apply(lis[i].scope, Array.prototype.slice.call(arguments, 1));
				if (lis[i].single) {
					lis.splice(i, 1);
					i--;
				}
			}
		},
		un: function (name, fn, scope) {
			var lis = this.__listeners[name] || [];
			if (!fn) {
				this.__listeners[name] = [];
			}
			for (var i = 0; i < lis.length; i++) {
				if (fn === lis[i].fn && (scope === lis[i].scope || !scope)) {
					lis.splice(i, 1);
					i--;
				}
			}
		}
	});

	var createScroll = function ($el, options) {
		if (!$el.data('zscroll')) {
			return new ZScroll($el, options);
		} else {
			return $el.data('zscroll');
		}
	};
	$.fn.zScroll = function (options) {
		this.each(function () {
			createScroll($(this), options).init();
		})
	};
	/**
	 * @param x
	 * @param y
	 */
	$.fn.zScrollTo = function (x, y) {
		this.each(function () {
			var zscroll = $(this).data('zscroll');
			if (!zscroll) {
				throw 'this dom have not zscroll object';
			}
			if (x !== undefined) {
				zscroll.scrollX(x - zscroll.scrollBox.scrollLeft(), true);
			}
			if (y !== undefined) {
				zscroll.scrollY(y - zscroll.scrollBox.scrollTop(), true);
			}
		});

	};


	if (typeof module != 'undefined' && module.exports) {
		module.exports = ZScroll;
	} else if (typeof define == 'function' && define.amd) {
		define(function () {
			return ZScroll;
		});
	} else {
		window.ZScroll = ZScroll;
	}

})(window, undefined);