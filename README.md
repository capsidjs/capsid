# class-component.js v5.5.1 <img align="right" src="http://kt3k.github.io/class-component/asset/class-component.svg" />

[![Build Status](https://travis-ci.org/kt3k/class-component.svg?branch=master)](https://travis-ci.org/kt3k/class-component) [![Coverage Status](https://coveralls.io/repos/kt3k/class-component/badge.svg?branch=master&service=github)](https://coveralls.io/github/kt3k/class-component?branch=master)

> Special html class tool

class-component.js is tool for creating a html class which has special functionality in addition to its default dom behaviour. For example, `bootstrap`'s "modal" class is a special class and when the user put `.modal` element in a page, it automatically behaves as a *modal*. This library helps you creating a such html class.

class-component.js is a jQuery plugin and exposes 2 namespaces: `$.cc` and `$.fn.cc`.

The size of the minified version of class-component.js is now 4.9KB.

## Install

### Using npm

```sh
npm install --save class-component
```

then

```js
global.jQuery = require('jquery');
require('class-component');
```

### Using bower

```sh
bower install --save jquery class-component
```

then

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

### Using a file directly

Download dist.min.js. Then

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

Because class-component.js is a jQuery plugin, you need to load jquery.js first.

## APIs

### `$.cc` namespace (static namespace)

#### `$.cc.register(className, func)`

This registers a initializing function `func` to the class name `className`.

- className `String` The name of the class component
- func `Function` The initilizing function of the class component

```js
$.cc.register('clear-btn', function (elem) {

    elem.on('click', function () {

        elem.trigger('item-clear');

    });

});
```

```html
<li class="clear-btn"></li>
```

In the above script, when `.clear-btn` class element is initialized, the click handler is attached and it triggers `item-clear` event.

#### `$.cc.assign(className, constructor)`

This is similar to `$.cc.register`, but a little bit different.
This assigns `constructor` as a constructor of the coelement of the class component of the given name `className`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(className)`.

- className `String` The class name of the component
- constructor `Function` The constructor of the coelement of the component

```js
$.cc.assign('todo-item', TodoItem);
```

```html
<li class="todo-item"></li>
```

#### `$.cc.init(className, element)`

This initializes the class components of the given name inside the given element. If the element is omitted, then it does in `document.body`. If the className is omitted, then it initializes all the registered class components. This method is useful when you want to add class components dynamically. The API automcatically prevent double initilization and therefore you don't need to care about it.

- className `String` The class name of the element
- element `HTMLElement|String` The element in which it initializes

#### `$.cc.subclass(parent, func)`

This is an utility to define and extend js classes. See details at [subclass repository](https://github.com/kt3k/subclass).

```js
$.cc.subclass(function (pt) {

    pt.constructor = function () { /* ... */ };

    pt.method = function () { /* ... */ };

});
```

### `$.fn.cc` namespace (instance APIs)

These are available through jQuery object's `.cc` property.

#### `$.fn.cc.get(className)`

This gets the coelement of the component of the given name if exists. It throws if none.

- className `String` The class name of the component

```js
var todoItem = elem.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

#### `$.fn.cc.init(className)`

This initializes an element as a class component. It throws if the class component of the given name is not registered.

- className `String` The class name of the component

```js
// Creates `todo-app` in #main
$('<div />').appendTo('#main').cc.init('todo-app');
```

In the above example, `<div>` is appended and it is initialized as `todo-app` class-component. (`todo-app` class is automcatically added)

## Glossary

### Class Component

<img align="right" width="300" src="http://kt3k.github.io/class-component/asset/the-diagram.svg" />

A class component is a html class which has special functionality.

`class-componenet.js` is a tool for creating class components in this sense.

### Coelement

(co- is a prefix for meaning the dual of something e.g. sine and cosine, tangent and cotangent etc.)

A coelement is a JavaScript class which defines a class-component together with its dual element.

The coelement is accessible with `elem.cc.get(name)` and the element is accesible with `this.elem`.

## Examples

- [Simple examples](https://github.com/kt3k/class-component/blob/master/EXAMPLE.md)
- [TodoMVC](https://github.com/kt3k/class-component-todomvc)

## License

MIT
