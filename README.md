# class-component.js v9.1.0 <img align="right" src="http://kt3k.github.io/class-component/asset/class-component.svg" />

[![Circle CI](https://circleci.com/gh/kt3k/class-component.svg?style=svg)](https://circleci.com/gh/kt3k/class-component) [![codecov.io](https://codecov.io/github/kt3k/class-component/coverage.svg?branch=master)](https://codecov.io/github/kt3k/class-component?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/kt3k/class-component/badges/score.svg)](https://www.bithound.io/github/kt3k/class-component)

> Yet another view framework

class-component.js is tool for appending **some special functions** to **html classes**. See below for details.

# Feature

- It is a **view framework**.
- It is a **jQuery plugin**.
- Exposes **2** namespaces: `$.cc` and `$.fn.cc`.
- **no virtual dom** ***hassle***
  - being **friendly with jQuery**
- **small number of APIs**
  - now it has **5** methods and **6** decorators.
- Does **not** introduce **any new language**
  - It uses plain javascript and html.
- **7.3KB** minified.

# The timer

The timer example in `$.cc`:

timer.js:

```js
class Timer {
  constructor() {
    this.secondsElapsed = 0
    this.start()
  }

  /**
   * Starts the timer.
   */
  start() {
    if (this.interval) return

    this.interval = setInterval(() => {
      this.tick()
    }, 1000)
  }

  /**
   * Ticks the timer.
   */
  tick() {
    this.secondsElapsed++
    this.elem.text('Seconds Elapsed:' + this.secondsElapsed)
  }

  /**
   * Stops the timer.
   */
  stop() {
    clearInterval(this.interval)
    delete this.interval
  }
}

$.cc('timer', Timer)
```

timer.html:

```html
<span class="timer"></span>
```

## Register your class-component

You can register the class-component of the given name by the following:

```js
$.cc('component-name', ComponentClass)
```

By the above call, dom elements which have `class="component-name"` are automatically initialized by ComponentClass.

## What happens when a class-component is *initialized*

The followings are exact steps when the class components are initialized.

```js
const coelem = new ComponentClass(elem) // The constructor is called with the element.

if (typeof coelem.__cc_init__ === 'function') {
  coelem.__cc_init__(elem) // If coelement has __cc_init__ method, then it's called.
} else {
  coelem.elem = elem // If it doesn't, then coelem.elem is assigned to elem.
}

elem.on([givenEvent], [givenSelector], [givenHandler]) // See `event` decorator section for details.

elem.addClass(componentName + '-initialized') // The element is marked `initialized`.

elem.data('__coelement:' + componentName, coelem) // The coelement is stored in the element.
```

where `elem` is jquery element which is initialized, `ComponentClass` is the registered coelement class and `componentName` is the registered component name.

## `this.elem`

After the constructor is called, this.elem is automatically set to jquery dom element by the framework. This behaviour can be overriden by defining the method `__cc_init__`. If your Coelement class has the `__cc_init__` method, then it's called instead.

```js
class MyComponent {
  __cc_init__(el) {
    this.el = el
  }
}

$.cc('my-component', MyComponent)
```

With the above example, the jquery element is stored in `this.el` instead of `this.elem`.

# Install

## Via npm

    npm install --save class-component

then do this:

```js
global.jQuery = require('jquery');
require('class-component');
```

## Via file

Download dist.min.js. Then:

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

***Note***: You need to load jquery.js first.

# APIs

There are 5 APIs.

- `$.cc`
  - Registers class-component.
- `$.cc.init`
  - Initializes class-component on the range.
- `$.fn.cc`
  - Initializes the element as class-component.
- `$.fn.cc.get`
  - Gets the coelement of the element.
- `$.fn.cc.init`
  - Initializes the element as a class-component.


## `$.cc` namespace

### `$.cc(className, Constructor)`

- @param {string} className The class name of the component
- @param {Function} Constructor The constructor of the coelement of the component

This registers `Constructor` as the constructor of the coelement of the class component of the given name `className`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(className)`.

Example:


```js
class TodoItem {
  // ...behaviours...
}

$.cc('todo-item', TodoItem)
```

```html
<li class="todo-item"></li>
```

### `$.cc.init(className, [range])`

- @param {string} className The class name to intialize
- @param {HTMLElement|string} range The range to initialize

This initializes the class components of the given name in the given range. If the range is omitted, it initializes them in the entire page. If the className is omitted, then it initializes all the registered class components.

This method is useful when you want to add class components dynamically.

## `$.fn.cc` namespace

These APIs are available via jQuery object's `.cc` property like `$('<div />').cc('timer')` or `$('#main').cc.get('app')`.

### `$.fn.cc(classNames)`

- @param {string} classNames The class names to initialize
- @return {jQuery}

This initializes the class-compenents of the given names on the element and returns the element itself.

```js
$('<div />').cc('timer modal').appendTo('body')
```

The above example creates a `div` element, initializes it as `timer` and `modal` class components, and appends it to the body.

### `$.fn.cc()`

This initializes all the class component on the element which it already has. This returns the the element (jquery-wrapped) itself.

Example:

```js
$('<div class="timer modal"/>').cc().appendTo('body')
```

The above example is the same as the previous one.

Example:

```js
var div = $('<div/>')

classes.forEach(cls => div.addClass(cls))

div.cc().appendTo('body')
```

The above example creates a `div` element and initializes all the classes in `classes` variable on in.

### `$.fn.cc.get(className)`

- @param {string} className The class name of the component

This gets the coelement of the component of the given name if exists. It throws if none.

```js
var todoItem = elem.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

### `$.fn.cc.init(className)`

This initializes an element as a class component of the given name. It throws an error if the class component of the given name isn't available.

This returns the instance of class-component class, not a dom element itself. If you want to get the dom element (jquery wrapped), use `$.fn.cc.up(classNames)`

- @param {string} className - The class name of the component

```js
// Creates `todo-app` in #main
$('<div />').appendTo('#main').cc.init('todo-app');
```

In the above example, `<div>` is appended and it is initialized as `todo-app` class-component. (`todo-app` class is automcatically added)

# Decorators

There are 6 decorators.

- `$.cc.component()`
- `$.cc.on()`
- `$.cc.on().at()`
- `$.cc.emit()`
- `$.cc.emit().last`
- `$.cc.emit().on.error`

## `$.cc.component(className)`

$.cc.component(className) is class decorator. With this decorator, you can regiter the js class as class component.

This is a shorthand of `$.cc('component', Component)`.

```js
const {component} = $.cc

@component('timer')
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `timer` component.

## `$.cc.on(eventName)`

`$.cc.on` is a method decorator. With this decorator, you can register the method as the event handler of the element.

```js
const {on} = $.cc

class Btn {

  @on('click')
  onClick(e) {
    ...definitions...
  }
}

$.cc('btn', Btn)
```

The above binds `onClick` method to its element's 'click' event automatically.

The above is equivalent of:

```js
class Btn {
  constructor(elem) {
    elem.on('click', e => {
      this.onClick(e)
    })
  }

  onClick(e) {
    ...definitions...
  }
}

$.cc('btn', Btn)
```

## `$.cc.on(eventName).at(selector)`

`$.cc.on(eventName).at(selector)` is a method decorator. It's similar to `$.cc.on`, but it only handles the event from `selector` in the component.

```js
const {on} = $.cc

class Btn {

  @on('click').at('.btn')
  onBtnClick(e) {
    ...definitions...
  }
}

$.cc('btn', Btn)
```

In the above example, `onBtnClick` method listens to the click event of the `.btn` element in the `Btn`'s element.

## `$.cc.emit(startEvent)`
## `$.cc.emit(startEvent).first`

`$.cc.emit()` (or `$.cc.emit().first`) is a method decorator. This decorator makes the method triggering of the given event at the start of the method.

```js
const {emit} = $.cc

class Manager {
  @emit('manager.started')
  start() {
    ...definitions...
  }
}

$.cc('manager', Manager)
```

The above `start` method automatically triggers `manager.started` event at the begining of the method process.

The above is equivalent of:

```js
class Manager {

  start() {
    this.elem.trigger('manager.started')
    ...definitions...
  }
}

$.cc('manager', Manager)
```

## `$.cc.emit(eventName).last`

`$.cc.emit(eventName).last` is similar to `$.cc.emit().first`, but it triggers the event at the last of the method.

```js
const {emit} = $.cc

class Manager {
  @emit('manager.ended').last
  start() {
    ...definitions...
  }
}

$.cc('manager', Manager)
```

In the above example, `start` method triggers the `manager.ended` event when it finished. The returns value of the method is passed as the second arguments of the event handler.

If the method returns a promise, then the event is triggered after the promise is resolved.

```js
const {emit} = $.cc

class Manager {
  @emit('manager.ended').last
  start() {
    ...definitions...

    return promise
  }
}

$.cc('manager', Manager)
```

In the above example, `manager.ended` event is triggered after `promise` is resolved. The resolved value of the promise is passed as the second argument of the event handler.

## `$.cc.emit(eventName).on.error`

`$.cc.emit(eventName).on.error` is similar to other `emit` decorators, but it triggers the event when the method errors.

```js
const {emit} = $.cc

class Manager {
  @emit('manager.error').on.error
  start() {
    ...definitions...
  }
}

$.cc('manager', Manager)
```

In the above example, `manager.error` is triggered when the method throws or the method returns rejected promise. The second argument of the event handler is the thrown error or rejected value.

# Glossary

## Class Component

<img align="right" width="300" src="http://kt3k.github.io/class-component/asset/the-diagram.svg" />

A class component is a html class which has special function.

A class component consists of the element (html dom element) and coelement (accompanying custom object).

The element in a class component is an usual html dom. The coelement accompanies to the element and adds special functions to it.

## Coelement

A coelement is a JavaScript class which supports the element to give it special functions.
A coelement defines a class-component together with its dual element.

The coelement is accessible with `elem.cc.get(name)` and the element is accesible with `coelem.elem`.

(co- is a prefix for meaning the dual of something e.g. sine and cosine, tangent and cotangent etc.)

# Examples

- [Simple examples](https://github.com/kt3k/class-component/blob/master/EXAMPLE.md)
- [TodoMVC](https://github.com/kt3k/class-component-todomvc)

# License

MIT
