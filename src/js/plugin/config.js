/**
 * Created by z-man on 2016/7/21.
 * @class config
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
module.exports = {
	handlers: ['click-bar', 'drag-bar', 'keyboard', 'wheel', 'touch'],
	/**
	 *  scroll bar min size (height or width)
	 */
	barMinSize: 50,
	scrollIncrement: 120,
	/*
	 position of scroll bar relative to content
	 values (string): "inside", "outside" (requires elements with not position:static)
	 */
	barPosition: "inside",
	autoHideBar: true,
	disableOver: ["select", "option", "keygen", "datalist", "textarea"]
};