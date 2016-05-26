# class-component.js v7.0.0 <img align="right" src="http://kt3k.github.io/class-component/asset/class-component.svg" />

[![Circle CI](https://circleci.com/gh/kt3k/class-component.svg?style=svg)](https://circleci.com/gh/kt3k/class-component) [![codecov.io](https://codecov.io/github/kt3k/class-component/coverage.svg?branch=master)](https://codecov.io/github/kt3k/class-component?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/kt3k/class-component/badges/score.svg)](https://www.bithound.io/github/kt3k/class-component)

> Yet another view framework

class-component.js is tool for appending **some special functions** to certain **html classes**. See below for details.

# Feature

- It is a **view framework**.
- It is a **jQuery plugin**.
- Exposes **2** namespaces: `$.cc` and `$.fn.cc`.
- **no virtual dom** ***hassle***
  - being **friendly with jQuery**
- **small number of APIs**
  - now it has **5** methods, **2** decorators and **1** class.
- **no scripts in html**
  - every logic is in `.js`
- **no alt js** required
- **no alt html** required
- **7.4KB** minified.

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

<script src="path/to/jquery.js"></script>
<script src="path/to/$.cc.js"></script>
<script src="path/to/timer.js"></script>
```

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

## APIs

### `$.cc` namespace

#### `$.cc(className, Constructor)`

- @param {string} className The class name of the component
- @param {Function} Constructor The constructor of the coelement of the component

This registers `Constructor` as the constructor of the coelement of the class component of the given name `className`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(className)`.


```js
class TodoItem {
  constructor(elem) {
    super(elem)
  }

  // ...other behaviours...
}

$.cc('todo-item', TodoItem)
```

```html
<li class="todo-item"></li>
```

#### `$.cc.init(className, [range])`

- @param {string} className The class name to intialize
- @param {HTMLElement|string} range The range to initialize

This initializes the class components of the given name inside the given element. If the element is omitted, then it does in `document.body`. If the className is omitted, then it initializes all the registered class components. This method is useful when you want to add class components dynamically. The API automcatically prevent double initilization and therefore you don't need to care about it.

### `$.fn.cc` namespace

These are available through jQuery object's `.cc` property.

#### `$.fn.cc.get(className)`

- @param {string} className The class name of the component

This gets the coelement of the component of the given name if exists. It throws if none.

```js
var todoItem = elem.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

#### `$.fn.cc.init(className)`

This initializes an element as a class component of the given name. It throws an error if the class component of the given name isn't available.

This returns the instance of class-component class, not a dom element itself. If you want to get the dom element (jquery wrapped), use `$.fn.cc.up(classNames)`

- @param {string} className - The class name of the component

```js
// Creates `todo-app` in #main
$('<div />').appendTo('#main').cc.init('todo-app');
```

In the above example, `<div>` is appended and it is initialized as `todo-app` class-component. (`todo-app` class is automcatically added)

#### `$.fn.cc(classNames)`

- @param {string} classNames The class names to initialize

This initializes the class compenents of the given names on the element and returns the element itself (jquery-wrapped).

```js
$('<div />').cc('timer modal').appendTo('body')
```

The above example creates a `div` element and initializes it as `timer` and `modal` class components. And finally append it to the body.

#### `$.fn.cc()`

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
