<img src="http://kt3k.github.io/classclamp/asset/classclamp.svg" />

[![Circle CI](https://circleci.com/gh/kt3k/classclamp.svg?style=svg)](https://circleci.com/gh/kt3k/classclamp)
[![codecov.io](https://codecov.io/github/kt3k/classclamp/coverage.svg?branch=master)](https://codecov.io/github/kt3k/classclamp?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/kt3k/classclamp/badges/score.svg)](https://www.bithound.io/github/kt3k/classclamp)
[![npm](https://img.shields.io/npm/v/classclamp.svg)](https://npm.im/classclamp)

> Class driven component framework

`classclamp` is a framework for creating UI Component based on HTML classes.

`classclamp` encourages the use of MVP design pattern. Components work as Presenter and Dom Elements work as (Passive) View of MVP. See the below for details.

`classclamp` doesn't encourage the use of virtual dom for updating the dom tree, rather it recommends updating dom using native DOM API.

# Features

- It's an **UI framework**.
- **no virtual dom, no template, no rendering**
- **small APIs**: 5 apis & 4 decorators
- **small size**: **2.9KB** minified (**1.3KB** gziped).

# The timer

The timer example:

timer.js:

```html
<span class="timer"></span>

<script src="path/to/classclamp.js"></script>
<script>
class Timer {
  __init__ () {
    this.secondsElapsed = 0
    this.start()
  }

  /**
   * Starts the timer.
   */
  start () {
    this.interval = setInterval(() => { this.tick() }, 1000)
  }

  /**
   * Ticks the timer.
   */
  tick () {
    this.secondsElapsed++
    this.el.textContent = `Seconds Elapsed: ${this.secondsElapsed}`
  }

  /**
   * Stops the timer.
   */
  stop () {
    clearInterval(this.interval)
  }
}

cc.def('timer', Timer)
</script>
```

See [the working demo](https://kt3k.github.io/classclamp/demo/timer.html).

# The concept

A `class-component` (or classclamp component) is a combination of `element` and `coelement`:

![diagram-1](http://kt3k.github.io/classclamp/asset/diagram-1.svg)

where:

- `element` is the usual dom element.
  - `<span class="timer"></span>` in the timer example
- `coelement` is JavaScript class which defines the behaviour of the special functions of the class-component.
  - `class Timer {...}` in the timer example.

`classclamp` is responsible for the following transition from the usual dom to a `class-component`.

![diagram-2](http://kt3k.github.io/class-component/asset/diagram-2.svg)

## Register your class-component

You can register the class-component of the given name like this:

```js
const cc = require('classclamp')

cc.def('component-name', ComponentClass)
```

By the above call, dom elements which have `class="component-name"` are automatically initialized with ComponentClass.

## What happens when a class-component is *initialized*

The followings are exact steps when a class-component is initialized.

```js
const coelem = new ComponentClass() // The constructor is called with the element.

// Sets the element to the coelement
coelem.el = el

// Adds event listeners
el.addEventListener(givenEvent, givenListener) // for each event/listener pair

// Adds initialized mark
el.classList.add(`${componentName}-initialized`) // The element is marked `initialized`.

el['__coelement:' + componentName] = coelem // The coelement is stored in the element.
```

where `el` is the dom element which is initialized, `ComponentClass` is the registered coelement class and `componentName` is the registered component name.

## `this.el`

`this.el` is HTMLElement which is associated with the coelement.

# :cd: Install

## Via npm

    npm install --save classclamp

then:

```js
const cc = require('classclamp')
```

## Via file

Download dist.min.js. Then:

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/classclamp.js"></script>
```

***Note***: You need to load jquery.js first.

# APIs

```js
const cc = require('classclamp')
```

- `cc.def(name, constructor)`
  - Registers class-component.
- `cc.init(name[, element])`
  - Initializes class-component on the range.
- `cc.el(name, element)`
  - Initializes the element with the class-component of the given name.
- `cc.get(name, element)`
  - Gets the coelement instance from the given element.
- `$dom.cc(name)`
  - Initializes the element as class-component.
- `$dom.cc.get(name)`
  - Gets the coelement of the element.
- `$dom.cc.init(name)` *deprecated*
  - Initializes the element as a class-component.

## `cc` namespace

### `cc.def(name, constructor)`

- @param {string} name The class name of the component
- @param {Function} constructor The constructor of the coelement of the component

This registers `constructor` as the constructor of the coelement of the class component of the given name `name`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(name)`.

Example:

```js
class TodoItem {
  // ...behaviours...
}

cc.def('todo-item', TodoItem)
```

```html
<li class="todo-item"></li>
```

### `cc.init([name], [element])`

- @param {string} [name] The class-component name to intialize
- @param {HTMLElement} [element] The range to initialize

This initializes the class components of the given name in the given element. If the element is omitted, it initializes them in the entire page. If the name is omitted, then it initializes all the registered class components.

### `cc.el(name, element)`

- @param {string} name The class-component name to initialize
- @param {HTMLElement} element The element to initialize

Initializes the element as the class-component.

```js
cc.el('timer', dom)
```

The above initializes `dom` as `timer` class-component.

### `cc.get(name, element)`

- @param {string} name The class-component name to get
- @param {HTMLElement} element The element
- @return The coelement instance

Gets the coelement instance from the element.

```js
const timer = cc.get('timer', dom)
```

The above gets `Timer` class instance (coelement) from dom. In this case, dom need to be initialized as `timer` class-component before this call.

## `$dom.cc` namespace

These APIs are available via jQuery selection object's `.cc` property like `$('<div />').cc('timer')` or `$('#main').cc.get('app')`.

### `$dom.cc(name)`

- @param {string} name The class-component name to initialize
- @return {jQuery}

This initializes the class-compenents of the given name on the element and returns the element itself.

```js
$('<div />').cc('timer').cc('modal').appendTo('body')
```

The above example creates a `div` element, initializes it as `timer` and `modal` class components, and appends it to the body.

### `$dom.cc()`

This initializes all the class component on the element which it already has. This returns the the element (jquery-wrapped) itself.

Example:

```js
$('<div class="timer modal"/>').cc().appendTo('body')
```

The above example is the same as the previous one.

Example:

```js
const div = $('<div/>')

classes.forEach(cls => div.addClass(cls))

div.cc().appendTo('body')
```

The above example creates a `div` element and initializes all the classes in `classes` variable on in.

### `$dom.cc.get(name)`

- @param {string} name The class name of the component

This gets the coelement of the component of the given name if exists. It throws if none.

```js
const todoItem = $dom.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

### `$dom.cc.init(name)` (deprecated)

This initializes the $dom as a class component of the given name. It throws an error if the class component of the given name isn't available.

This returns the instance of class-component class, not a dom element itself. If you want to get the dom element (jquery wrapped), use `$.fn.cc.up(classNames)`

- @param {string} name - The class name of the component

```js
// Creates `todo-app` in #main
$('<div />').appendTo('#main').cc.init('todo-app')
```

In the above example, `<div>` is appended and it is initialized as `todo-app` class-component. (`todo-app` class is automcatically added)

# Decorators

There are 4 decorators.

- `@component`
  - optionally `@component(name)`
- `@on(event, {at})`
- `@emit(event)`
  - optionally `@emit.last(event)`
- `@wire`
  - optionally `@wire(name, [selector])`

## `@component(className)`

cc.component(className) is class decorator. With this decorator, you can regiter the js class as class component.

This is a shorthand of `$.cc('component', Component)`.

```js
const { component } = cc

@component('timer')
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `timer` component.

## `@component`

cc.component is similar to the above. This decorator registers the js class as the class component of the same name. If the js class is in `CamelCase`, then the component name is made `kebab-cased`.

```js
const { component } = cc

@component
class Timer {} // This registers Timer class as `timer` component

@component
class FooBar {} // This registers FooBar class as `foo-bar` component
```

## `@on(eventName)`

`cc.on` is a method decorator. With this decorator, you can register the method as the event handler of the element.

```js
const { on } = cc

class Btn {

  @on('click')
  onClick (e) {
    ...definitions...
  }
}

cc.def('btn', Btn)
```

The above binds `onClick` method to its element's 'click' event automatically.

The above is equivalent of:

```js
class Btn {
  __init__ () {
    this.el.addEventListener('click', e => {
      this.onClick(e)
    })
  }

  onClick (e) {
    ...definitions...
  }
}

cc.def('btn', Btn)
```

## `@on(name, { at: selector })`

`cc.on(name, { at: selector })` is a method decorator. It's similar to `cc.on`, but it only handles the event from `selector` in the component.

```js
const { on } = cc

class Btn {
  @on('click', { at: '.btn' })
  onBtnClick (e) {
    ...definitions...
  }
}

cc.def('btn', Btn)
```

In the above example, `onBtnClick` method listens to the click event of the `.btn` element in the `Btn`'s element.

## `@emit(startEvent)`

`cc.emit()` is a method decorator. This decorator makes the method trigger the given event at the start of the method. The first parameter of the method is passed as event.detail object.

```js
const { emit } = cc

class Manager {
  @emit('manager.started')
  start () {
    ...definitions...
  }
}

cc.def('manager', Manager)
```

The above `start` method automatically triggers `manager.started` event at the begining of the method process.

The above is equivalent of:

```js
class Manager {
  start () {
    this.$el.trigger('manager.started', arguments)
    ...definitions...
  }
}

cc.def('manager', Manager)
```

## `@emit.last(eventName)`

`cc.emit.last(eventName)` is similar to `cc.emit()`, but it triggers the event at the last of the method.

```js
const { emit } = cc

class Manager {
  @emit.last('manager.ended')
  start() {
    ...definitions...
  }
}

cc.def('manager', Manager)
```

In the above example, `start` method triggers the `manager.ended` event when it finished. The returns value of the method is passed as the second arguments of the event handler.

If the method returns a promise, then the event is triggered after the promise is resolved.

```js
const { emit } = cc

class Manager {
  @emit.last('manager.ended')
  start () {
    ...definitions...

    return promise
  }
}

cc.def('manager', Manager)
```

In the above example, `manager.ended` event is triggered after `promise` is resolved. The resolved value of the promise is passed as the second argument of the event handler.

## `@wire`

`@wire` is a getter decorator. If a getter is decorated by this, it returns the class component of the name of the decorated method.

```js
const { wire, component } = require('class-component')

@component
class Foo {
  @wire get bar () {}

  processBar () {
    this.bar.process()
  }
}

@component
class Bar {
  process () {
    console.log('processing bar!')
  }
}

$('body').append('<div class="foo"><div class="bar"></div></div>')
```

In the above situation, the getter `bar` of Foo class is wired to `bar` component inside the foo component. Technically accessing `bar` property almost equals to the call of `this.$el.find('.bar').cc.get('bar')`. With the above settings you can call the following:

```js
$('.foo').cc.get('foo').processBar()
```

And the above prints `processing bar!`.

When the decorated getter name is in `CamelCase`, then it's replaced by the `kebab-cased` version. For example, the expression `@wire get primaryButton` wires to `primary-button` component, not to `primaryButton` component. If you need to wire it to `primaryButton` component, then use the one below.

## `@wire(className)`

This is also a getter decorator. The difference is that `@wire(className)` specify the wired class component name explicitly (`className`).

```js
const { wire, component } = require('classclamp')

@component
class Foo {
  @wire('long-name-component') get it () {}
}

@component
class LongNameComponent {
  process () {
    console.log('processing long name component!')
  }
}

$('body').append('<div class="foo"><div class="long-name-component"></div></div>')
```

With the above settings, you can call the following:

```js
$('.foo').cc.get('foo').it.process()
```

And this prints `processing long name component`.

`@wire` and `@wire(name)` decorators are convenient when you nest the class components and parents ask children do the jobs.

# License

MIT

# History
- 2017-01-xx   v0.1.0

# History of class-component.js (former project)
- 2017-01-02   v13.0.0   Add __init__ instead of init.
- 2017-01-01   v12.1.1   Fix bug of event bubbling.
- 2017-01-01   v12.1.0   Remove @emit.first. Use native dispatchEvent.
- 2016-12-31   v12.0.0   Remove __cc_init__ feature. Add init feature.
- 2016-09-30   v10.7.1   Refactor @emit.last decorator
- 2016-09-11   v10.7.0   Add @on(event, {at}) @emit.first and @emit.last
- 2016-08-22   v10.6.2   Refactor the entrypoint.
- 2016-08-22   v10.6.1   Improved the event listener registration process.
- 2016-08-20   v10.6.0   Cleaned up some private APIs.
- 2016-08-20   v10.5.0   Cleaned up codebase and made the bundle smaller. Remove some private APIs.
- 2016-08-17   v10.4.1   Made built version smaller.
- 2016-08-16   v10.4.0   Switched to babel-preset-es2015-loose.
- 2016-08-16   v10.3.0   Modified bare @wire decorator.
- 2016-08-02   v10.2.0   Added bare @component decorator.
- 2016-07-21   v10.1.0   Added @wire decorator.
- 2016-06-19   v10.0.0   Removed deprecated decorators `@event` and `@trigger`, use `@on` and `@emit` instead.
- 2016-06-09   v9.2.0    Fixed bug of `@emit().last` decorator.

# The user projects

The projects which uses class-component.js.

- [class-component-todomvc](https://github.com/kt3k/class-component-todomvc)
  - Implementation of TodoMVC in class-component.js, 100% unit tested
- [multiflip](https://github.com/kt3k/multiflip)
- [multiflip-bubble](https://github.com/kt3k/multiflip-bubble)
- [puncher](https://github.com/kt3k/puncher)
- [event-hub](https://github.com/kt3k/event-hub)
- [spn](https://github.com/kt3k/spn)
- [view-todo](https://github.com/kt3k/view-todo)
- [long-dream](https://github.com/kt3kstudio/long-dream-core)
  - The Long Dream is the first user and absolute inspiration of classclamp
  - classclamp is basically created for developing this project.

# Notes

## Why 'coelement'

`co-` means the dual or the other aspect of something like `cosine` to `sine` `cotangent` to `tangent` etc. Coelement is the other aspect of `element` and it works together in the 1-to-1 relationship and in the same lifecycle with the element.
