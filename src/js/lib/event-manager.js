'use strict';

var EventElement = function (element) {
	this.element = element;
	this.events = {};
};

EventElement.prototype.on = function (eventName, handler) {
	if (typeof this.events[eventName] === 'undefined') {
		this.events[eventName] = [];
	}
	this.events[eventName].push(handler);
	if (this.element.addEventListener) {
		this.element.addEventListener(eventName, handler, false);
	} else if (this.element.attachEvent) {
		this.element.attachEvent(eventName, handler);
	}

};

EventElement.prototype.off = function (eventName, handler) {
	var isHandlerProvided = (typeof handler !== 'undefined');
	this.events[eventName] = this.events[eventName].filter(function (hdlr) {
		if (isHandlerProvided && hdlr !== handler) {
			return true;
		}
		if (this.element.removeListener) {
			this.element.removeEventListener(eventName, hdlr, false);
		} else if (this.element.detachEvent) {
			this.element.detachEvent(eventName, hdlr);
		}
		return false;
	}, this);
};

EventElement.prototype.offAll = function () {
	for (var name in this.events) {
		this.off(name);
	}
};

var EventManager = function () {
	this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
	var ee = this.eventElements.filter(function (eventElement) {
		return eventElement.element === element;
	})[0];
	if (typeof ee === 'undefined') {
		ee = new EventElement(element);
		this.eventElements.push(ee);
	}
	return ee;
};

EventManager.prototype.on = function (element, eventName, handler) {
	this.eventElement(element).on(eventName, handler);
};
EventManager.prototype.off = function (element, eventName, handler) {
	this.eventElement(element).off(eventName, handler);
};
EventManager.prototype.offAll = function () {
	for (var i = 0; i < this.eventElements.length; i++) {
		this.eventElements[i].offAll();
	}
};
EventManager.prototype.once = function (element, eventName, handler) {
	var ee = this.eventElement(element);
	var onceHandler = function (e) {
		ee.off(eventName, onceHandler);
		handler(e);
	};
	ee.on(eventName, onceHandler);
};

module.exports = EventManager;
