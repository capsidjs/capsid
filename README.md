# class-component.js v5.3.1 <img align="right" src="http://kt3k.github.io/class-component/asset/class-component.svg" />

[![Build Status](https://travis-ci.org/kt3k/class-component.svg?branch=master)](https://travis-ci.org/kt3k/class-component) [![Coverage Status](https://coveralls.io/repos/kt3k/class-component/badge.svg?branch=master&service=github)](https://coveralls.io/github/kt3k/class-component?branch=master)

> A jQuery plugin for creating Class based Component.

## How to use

### Via npm

```sh
npm install --save class-component
```

then

```js
global.jQuery = require('jquery');
require('class-component');
```

### Via bower

```sh
bower install --save jquery class-component
```

then

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

### File

Download dist.min.js. Then

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

## APIs

### `$.cc` namespace

or static APIs.

#### `$.cc.register(className, func)`

This registers a class component by its name and defining function.

- className `String` The name of the class component
- func `Function` The defining function of the class component

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

The defining function takes one paramter which is jQuery object of a dom which it modifies. You can operate and modify on it using jQuery APIs.

#### `$.cc.assign(className, constructor)`

This assigns the coelement class to the class component of the given name. See the Glossary for what a coelement is.

- className `String` The class name of the component
- constructor `Function` The constructor of the coelement of the component

```js
$.cc.assign('todo-item', TodoItem);
```

```html
<li class="todo-item"></li>
```

#### `$.cc.init(className, element)`

This initializes the class components of the given name inside the given element. If the element is omitted, then it does in `document.body`. If the className is omitted, then it initializes all the registered class components.

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

### `$.fn.cc` namespace

or instance APIs. These are available through jQuery object's `.cc` property.

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

## Glossary

### Dom Component

A Dom Component is a group of html elements which has some special functions and/or behaviours in addition to its default behaviours.

### Class Component

A Class Component (or Class based Component) is a group of html elements which has some special functions and/or behaviours in addition to its default behaviours and is characterize by its *html class name*.

`class-componenet.js` is a tool for defining a class component in this sense.

### Coelement

A Coelement is a type of js classes which is meant to accompany an html element and characterize its behavior as a Dom Component.

More technically a coelement class is a class which is instanciated when the accompanying class component is initialized and its instance is attached to the dom (using jQuery's data api) and can be retrieved by calling `elem.cc.get(componentName)`.

## Examples!

- [Simple examples](https://github.com/kt3k/class-component/EXAMPLE.md)
- [TodoMVC](https://github.com/kt3k/class-component-todomvc)

## License

MIT
