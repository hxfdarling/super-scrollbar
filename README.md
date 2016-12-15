# super-scrollbar
Custom scroll bar component supports chrome,edge,safari,fireFox,ie8+ browser

Perfect realization of the touchpad, touch screen, drag the mouse wheel, mouse, keyboard events to monitor, comparable to the browser native scroll

The original DOM tree without making any changes, just added a custom scrollbar element

Without any changes to the existing js code only be initialized once requires a custom scrolling region

Do not rely on any third party libraries

Support jQuery plugin called

## About

  super-scrollbar.js is a small JavaScript library making dom scroll

## Installation
  
  you can install by npm:
```
npm install --save super-scrollbar

```
  With a stand-alone build
```html
<link href="super-scrollbar.css" rel="stylesheet">
<script src='super-scrollbar.js'></script>
```

## Example

sample
```
<link href="super-scrollbar.css" rel="stylesheet">
<script src='super-scrollbar.js'></script>
```

  in webpack project:
```js
var SuperScrollbar = require('super-scrollbar');
```
### initialize

```js
SuperScrollbar.initialize(document.querySelector('#id'));
```   
### update
```js
SuperScrollbar.update(document.querySelector('#id'));
```
### destroy
```js
SuperScrollbar.destroy(document.querySelector('#id'));	
```
### License

 Based on the [perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar)
 
 The MIT License (MIT) Copyright (c) 2016 zman and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
