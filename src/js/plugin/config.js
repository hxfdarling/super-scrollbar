/**
 * Created by z-man on 2016/7/21.
 * @class config
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
module.exports = {
	handlers: ['click-rail', 'drag-bar', 'keyboard', 'wheel', 'touch','selection'],
	/**
	 *  scroll bar min size (height or width)
	 */
	barMinSize: 50,
	wheelSpeed: 1,
	keyScrollIncrement: 100,//key step
	autoHideBar: true,
	stopPropagationOnClick: true,
	wheelPropagation: true,
	swipePropagation:true,
	autoUpdate:true//自动更新
};