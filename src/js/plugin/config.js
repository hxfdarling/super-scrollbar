/**
 * Created by z-man on 2016/7/21.
 * @class config
 * @author z-man
 * @date 2016/7/21
 * @description 描述该类...
 */
'use strict';
module.exports = {
	handlers: ['click-rail', 'drag-bar', 'keyboard', 'wheel', 'touch', 'selection'],
	wrapElement: false,//是否包裹滚动元素,可以解决在ie8，ie9下面滚动条抖动问题,但是会对被滚动元素包裹一层div
	/**
	 *  scroll bar min size (height or width)
	 */
	barMinSize: 20,
	wheelSpeed: 1,
	keyScrollIncrement: 100,//key step
	autoHideBar: true,
	stopPropagationOnClick: true,
	wheelPropagation: true,
	swipePropagation: true,
	forceUpdate: true,//如果需要对textArea进行滚动操作，需要注意将wrapElement开启，并将此项关闭
	autoUpdate: true//自动更新
};