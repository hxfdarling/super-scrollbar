# super-scrollbar
自定义滚动组件，支持chrome,edge,safari,fireFox,ie8及以上浏览器

完美实现了对触摸板、触屏、鼠标滚轮、鼠标拖拽、键盘事件的监控，媲美浏览器原生滚动

支持连级滚动，缓动滚动

对原有dom树不做任何改动，仅增加了自定义滚动条元素

不用对原有的js代码做任何改动，仅需在对需要自定义滚动区域初始化一次即可

不依赖与任何第三方库

支持jquery插件调用

## About

  super-scrollbar.js is a small JavaScript library making dom scroll

## Installation
  

  With a stand-alone build

    <script src='super-scrollbar.js'></script>


## Example

	<script src='super-scrollbar.js'></script>

### initialize
  
    SuperScrollbar.initialize(document.querySelector('#id'));
    
### update

    SuperScrollbar.update(document.querySelector('#id'));
    
### destroy

	SuperScrollbar.destroy(document.querySelector('#id'));	
