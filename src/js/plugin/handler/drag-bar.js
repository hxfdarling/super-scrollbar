/**
 * Created by z-man on 2016/7/21.
 * @class drag-scrollbar
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';

var instances = require('../instances');
var update = require('../update');
var updateScroll = require('../update-scroll');
var helper = require('../lib/helper');

function bindMouseScrollXHandler(element, instance) {
    var currentLeft = null;
    var currentPageX = null;

    function updateScrollLeft(deltaX) {
        var newLeft = currentLeft + (deltaX * instance.railXRatio);
        var maxLeft = Math.max(0, instance.barXRail.getBoundingClientRect().left) + (instance.railXRatio * (instance.railXWidth - instance.barXWidth));

        if (newLeft < 0) {
            instance.currentScroll.x = 0;
        } else if (newLeft > maxLeft) {
            instance.currentScroll.x = maxLeft;
        } else {
            instance.currentScroll.x = newLeft;
        }

        var scrollLeft = helper.toInt(instance.currentScroll.x * (instance.contentWidth - instance.containerWidth) / (instance.containerWidth - (instance.railXRatio * instance.scrollbarXWidth))) - instance.negativeScrollAdjustment;
        updateScroll(element, 'left', scrollLeft);
    }

    var mouseMoveHandler = function(e) {
        updateScrollLeft(e.pageX - currentPageX);
        update(element);
        e.stopPropagation();
        e.preventDefault();
    };

    var mouseUpHandler = function() {
        helper.stopScrolling(element, 'x');
        instance.event.unbind(instance.ownerDocument, 'mousemove', mouseMoveHandler);
    };

    instance.event.bind(instance.barX, 'mousedown', function(e) {
        currentPageX = e.pageX;
        currentLeft = helper.toInt(dom.css(instance.barX, 'left')) * instance.railXRatio;
        helper.startScrolling(element, 'x');

        instance.event.bind(instance.ownerDocument, 'mousemove', mouseMoveHandler);
        instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);

        e.stopPropagation();
        e.preventDefault();
    });
}

function bindMouseScrollYHandler(element, instance) {
    var currentTop = null;
    var currentPageY = null;

    function updateScrollTop(deltaY) {
        var newTop = currentTop + (deltaY * instance.railYRatio);
        var maxTop = Math.max(0, instance.scrollbarYRail.getBoundingClientRect().top) + (instance.railYRatio * (instance.railYHeight - instance.scrollbarYHeight));

        if (newTop < 0) {
            instance.scrollbarYTop = 0;
        } else if (newTop > maxTop) {
            instance.scrollbarYTop = maxTop;
        } else {
            instance.scrollbarYTop = newTop;
        }

        var scrollTop = helper.toInt(instance.scrollbarYTop * (instance.contentHeight - instance.containerHeight) / (instance.containerHeight - (instance.railYRatio * instance.scrollbarYHeight)));
        updateScroll(element, 'top', scrollTop);
    }

    var mouseMoveHandler = function(e) {
        updateScrollTop(e.pageY - currentPageY);
        updateGeometry(element);
        e.stopPropagation();
        e.preventDefault();
    };

    var mouseUpHandler = function() {
        helper.stopScrolling(element, 'y');
        instance.event.unbind(instance.ownerDocument, 'mousemove', mouseMoveHandler);
    };

    instance.event.bind(instance.scrollbarY, 'mousedown', function(e) {
        currentPageY = e.pageY;
        currentTop = helper.toInt(dom.css(instance.scrollbarY, 'top')) * instance.railYRatio;
        helper.startScrolling(element, 'y');

        instance.event.bind(instance.ownerDocument, 'mousemove', mouseMoveHandler);
        instance.event.once(instance.ownerDocument, 'mouseup', mouseUpHandler);

        e.stopPropagation();
        e.preventDefault();
    });
}

module.exports = function(element) {
    var instance = instances.get(element);
    bindMouseScrollXHandler(element, instance);
    bindMouseScrollYHandler(element, instance);
};