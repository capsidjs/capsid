<img src="http://capsidjs.github.io/capsid/asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/capsidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://codecov.io/github/capsidjs/capsid?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/capsidjs/capsid.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)

> Component-based DOM programming

`capsid` is a library for component-based DOM programming.

`capsid` gives behaviors to the classes of html elements based on the component definitions. See [Hello Example][] :wave: or [Clock Example][] :stopwatch:.

`capsid` uses decorators for defining event handlers and event emitters declaratively. See [Mirroring Example][] :butterfly: and [Counter Example][] :level_slider:.

For state management, `capsid` has [evex][], which is the variation of [flux][] design pattern by using DOM events. Please check [evex][] repository for details.

# :sparkles: Features

- **Component-based DOM programming library**
- :leaves: Lightweight: **~1.83KB**
- :sunglasses: **no dependencies**
- :sunny: **Plain JavaScript (+ ESNext decorators)**
- :bento: Adds **behaviors** (event handlers and lifecycles) to **classes** of elements based on **component** definition.
- :lollipop: **7 APIs** & **5 decorators**

# :wave: [Hello Example][]

The hello example shows the minimal usage of capsid.js:

```html
<script src="https://unpkg.com/capsid"></script>
<script>
class Hello {
  __mount__ () {
    this.el.textContent = 'Hello, world!'
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

`capsid.def('hello', Hello)` defines `hello` component and it initializes `<span class="hello"></span>` with `hello` component [when document is ready][DOMContentLoaded]. When initializing the component, `__mount__` method is called and in this case `textContent` of the element becomes `Hello, world!`.

[See the demo][Hello Example]

# :butterfly: [Mirroring Example][]

The mirroring example shows how you can mirror the input to a different dom in capsid.js.

```html
<script src="https://unpkg.com/capsid"></script>
<script>
const { def, on, wired } = capsid

class Mirroring {
  @wired('.dest') get dest () {}
  @wired('.src') get src () {}

  @on('input') onReceiveData (e) {
    this.dest.textContent = this.src.value
  }
}

def('mirroring', Mirroring)
</script>

<div class="mirroring">
  <p>
    <input class="src" placeholder="Type something here" />
  </p>
  <p class="dest"></p>
</div>
```

With the above example, the input value of `.src` is copied to `.dest` on each input event.

[See the demo][Mirroring Example]

# Initialization

There are 2 ways to initialize components:

1. [When document is ready][DOMContentLoaded] (automatic).
2. When `capsid.prep()` is called (manual).

All components are initialized automatically when document is ready. You don't need to care about those elements which exist before document is ready. See [Hello Example][] or [Clock Example][] for example.

If you add elements after document is ready (for example, after ajax requests), call `capsid.prep()` and that initializes all the components.

```js
const addPartOfPage = async () => {
  const { html } = await axios.get('path/to/something.html')

  containerElemenent.innerHTML = html

  capsid.prep() // <= this initializes all the elements which are not yet initialized.
})
```

# :cd: Install

## Via npm

    npm install --save capsid

then:

```js
const capsid = require('capsid')
```

## Via file

Download [capsid.min.js](https://unpkg.com/capsid@0.27.1/dist/capsid.min.js) Then:

```html
<script src="path/to/capsid.js"></script>
```

In this case, the library exports the global variable `capsid`.

```js
capsid.def('my-component', MyComponent)
```

# Capsid Lifecycle

φ -> [mount] -> component -> [unmount] -> φ

## capsid lifecycle events

There are 2 lifecycle events in capsid: `mount` and `unmount`.

- `mount`
  - HTML elements are mounted by the components.
  - An element is coupled with the corresponding coelement and they start working together.
  - The timing of `mount` is either `DOMContentLoaded` or `capsid.prep()`.

- `unmount`
  - An element is decouple with the coelement.
  - All events are removed and coelement is discarded.
  - You need to call `unmount(class, element)` to unmount the component.

## Explanation of `mount`

At `mount` event, these things happen.

- The component class's `instance` (coelement) is created.
- `instance`.el is set to corresponding dom element.
- event listeners defined by `@on` decorators are attached to the dom element.
- plugin hooks are invoked if you use any.
- if `instance` has __mount__ method, then `instance.__mount__()` is called.

The above happens in this order. Therefore you can access `this.el` and you can invoke the events at `this.el` in `__mount__` method.

## Lifecycle Methods

### `constructor`

The constructor is called at the start of `mount`ing. You cannot access `this.el` here. If you need to interact with html, `__mount__` is more appropriate place.

### `__mount__`

`__mount__()` is called at the **end** of the mount event. When it called, the dom element and event handlers are ready and available through `this.el`.

### `__unmount__`

`__unmount__()` is called when component is unmounted. If your component put resources on global space, you should discard them here to avoid memory leak.

# Coelement

The concept of 'coelement' is explained at [Component and Coelement](http://capsidjs.github.io/capsid/basics/component.html) section of the document site.

# APIs

```js
const {
  def,
  prep,
  make,
  mount,
  unmount,
  get,
  install
} = require('capsid')
```

- `def(name, constructor)`
  - Registers class-component.
- `prep([name], [element])`
  - Initialize class-component on the given range.
- `make(name, element)`
  - Initializes the element with the component of the given name and return the coelement instance.
- `mount(Constructor, element)`
  - Initializes the element with the component of the given class and return the coelement.
- `unmount(name, element)`
  - unmount the component from the element by its name.
- `get(name, element)`
  - Gets the coelement instance from the given element.
- `install(capsidModule, options)`
  - installs the capsid module with the options.

## `def(name, constructor)`

- @param {string} name The class name of the component
- @param {Function} constructor The constructor of the coelement of the component

This registers `constructor` as the constructor of the coelement of the class component of the given name `name`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(name)`.

Example:

```js
class TodoItem {
  // ...behaviours...
}

capsid.def('todo-item', TodoItem)
```

```html
<li class="todo-item"></li>
```

## `prep([name], [element])`

- @param {string} [name] The capsid component name to intialize
- @param {HTMLElement} [element] The range to initialize

This initializes the capsid components of the given name under the given element. If the element is omitted, it initializes in the entire page. If the name is omitted, then it initializes all the registered class components in the given range.

## `make(name, element)`

- @param {string} name The capsid component name to initialize
- @param {HTMLElement} element The element to initialize
- @return {<Component>} created coelement

Initializes the element as the capsid component and returns the coelement instance.

```js
const timer = make('timer', dom)
```

## `mount(Constructor, element)`

- @param {Function} Constructor The constructor which defines the capsid component
- @param {HTMLElemen} element The element to mount the component
- @return {<Constructor>} The created coelement

Initializes the element with the component of the given class and return the coelement.

```js
class Component {
  __mount__ () {
    this.el.foo = 1
  }
}

capsid.mount(Component, div)

div.foo === 1 # => true
```

Usually you don't need to use this API. If you're writing library using capsid, you might sometimes need to create an unnamed component and need this API then.

## `unmount(name, element)`

- @param {string} name The component name
- @param {HTMLElement} element The element

Unmounts the component of the given name from the element.

Example:

```js
@component('foo')
class Foo {
  @on('input')
  remove () {
    unmount('foo', this.el)
  }
}
```

The above example unmounts itself when it receives `input` event.

## `get(name, element)`

- @param {string} name The capsid component name to get
- @param {HTMLElement} element The element
- @return The coelement instance

Gets the component instance from the element.

```js
const timer = capsid.get('timer', el)
```

The above gets timer coelement from `el`, which is instance of `Timer` class.

### `install(capsidModule[, options])`

- @param {CapsidModule} capsidModule The module to install
- @param {Object} options The options to pass to the module

This installs the capsid module.

```js
capsid.install(require('capsid-popper'), { name: 'my-app-popper' })
```

See [capsid-module][] repository for details.

# Decorators

```js
const {
  component,
  on,
  emits,
  wired,
  notifies
} = require('capsid')
```

There are 5 types of decorators.

- `@component`
  - *class decorator*
  - registers as a capsid components.
  - optionally `@component(name)`
- `@on(event, { at })`
  - *method decorator*
  - registers as an event listener on the component.
  - `@on.click` is a shorthand for `@on('click')`.
  - `@on.click.at(selector)` is a shorthand for `@on('click', { at: selector })`.
- `@emits(event)`
  - *method decorator*
  - makes the decorated method an event emitter.
  - optionally `@emits.first(event)`
- `@wired(selector)`
  - *getter decorator*
  - wires the elements to the decorated getter by the given selector.
  - optionally `@wired.component(name, [selector])` `@wired.all(selector)`
- `@notifies`
  - *method decorator*
  - makes the decorated method an event broadcaster.

## `@component(className)`

capsid.component(className) is class decorator. With this decorator, you can regiter the js class as class component.

This is a shorthand of `capsid.def('component', Component)`.

```js
const { component } = require('capsid')

@component('timer')
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `timer` component.

## `@component`

`@component` is similar to the above. This decorator registers the js class as the class component of the same name. If the js class is in `CamelCase`, then the component name is made `kebab-cased`.

```js
const { component } = require('capsid')

@component
class Timer {} // This registers Timer class as `timer` component

@component
class FooBar {} // This registers FooBar class as `foo-bar` component
```

## `@on(eventName)`

`@on` is a method decorator. With this decorator, you can register the method as the event handler of the element.

```js
const { on } = capsid

class FooButton {

  @on('click')
  onClick (e) {
    ...definitions...
  }
}

capsid.def('foo-btn', FooButton)
```

The above binds `onClick` method to its element's 'click' event automatically.

The above is equivalent of:

```js
class FooButton {
  __mount__ () {
    this.el.addEventListener('click', e => {
      this.onClick(e)
    })
  }

  onClick (e) {
    ...definitions...
  }
}

capsid.def('foo-btn', FooButton)
```

## `@on(name, { at: selector })`

`@on(name, { at: selector })` is a method decorator. It's similar to `@on`, but it only handles the event from `selector` in the component.

```js
const { on } = capsid

class Btn {
  @on('click', { at: '.btn' })
  onBtnClick (e) {
    ...definitions...
  }
}

capsid.def('btn', Btn)
```

In the above example, `onBtnClick` method listens to the click event of the `.btn` element in the `Btn`'s element.

## `@on.click`

`@on.click` is a shorthand for `@on('click')`.

```js
class Foo {
  @on.click
  onClick {
    // handling of the click of the Foo component
  }
}
```

## `@on.click.at(selector)`

`@on.click.at(selector)` is a shorthand for `@on('click', { at: selector })`

```js
class Foo {
  @on.click.at('.edit-button')
  onClickAtEditButton () {
    // handling of the click of the edit button
  }
}
```

**NOTE:** You can add this type of short hand by calling `on.useHandler(eventName)`.

```js
on.useHandler('change')

class Foo {
  @on.change.at('.title-input') // <= This is enabled by the above useHandler call.
  onChangeAtTitleInput () {
    // handles the change event of title input field.
  }
}
```

## `@emits.first(startEvent)`

`@emits.first()` is a method decorator. This decorator makes the method trigger the given event at the start of the method. The first parameter of the method is passed as event.detail object.

```js
const { emits, def } = require('capsid')

class Manager {
  @emits.first('manager.started')
  start () {
    ...definitions...
  }
}

def('manager', Manager)
```

The above `start` method automatically triggers `manager.started` event at the begining of the method process.

The above is equivalent of:

```js
class Manager {
  start () {
    this.el.dispatchEvent(new CustomEvent('manager.started', {
      bubbles: true,
      detail: arguments[0]
    }))
    ...definitions...
  }
}

capsid.def('manager', Manager)
```

## `@emits(eventName)`

`@emits(eventName)` is similar to `@emits.first()`, but it triggers the event at the end of the method.

```js
const { emits, def } = require('capsid')

class Manager {
  @emits('manager.ended')
  start() {
    ...definitions...
  }
}

def('manager', Manager)
```

In the above example, `start` method triggers the `manager.ended` event when it finished. The returns value of the method is passed as `detail` of the event object. So you can pass the data from children to parents.

If the method returns a promise, then the event is triggered after the promise is resolved.

```js
const { emits, def } = require('capsid')

class Manager {
  @emits('manager.ended')
  start () {
    ...definitions...

    return promise
  }
}

def('manager', Manager)
```

In the above example, `manager.ended` event is triggered after `promise` is resolved. The resolved value of the promise is passed as `detail` of the event object.

## `@wired.component`

`@wired.component` is a getter decorator. If a getter is decorated by this, it returns the class component of the name of the decorated method.

```js
const { wired, component } = require('capsid')

@component
class Foo {
  @wired.component get bar () {}

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

When the decorated getter name is in `CamelCase`, then it's replaced by the `kebab-cased` version. For example, the expression `@wired.component get primaryButton` wires to `primary-button` component, not to `primaryButton` component. If you need to wire it to `primaryButton` component, then use the one below.

## `@wired.component(className)`

This is also a getter decorator. The difference is that `@wire(className)` specify the wired class component name explicitly (`className`).

```js
const { wired, component } = require('capsid')

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

`@wired.component` and `@wired.component(name)` decorators are convenient when you nest the components.

## @wired(selector) get element () {}

- @param {string} selector The selector to look up the element in the component

This wires the element selected by the given selector to the decorated getter. This is similar to `@wire` decorator, but it wires HTMLElmenent, not capsid component.

## @wired.all(selector) get elements () {}

- @param {string} selector The selector to look up the elements in the component

This wires the all elements selected by the given selector to the decorated getter. This is similar to `@wire.elAll` decorator, but it wires all the elements, not the first one.

## @notifies(event, selector)

- @param {string} event The event type
- @param {string} selector The selector to notify events

`@notifies` is a method decorator. It adds the function to publishes the event to its descendant elements at the end of the decorated method.

```
@component
class Component {
  @notifies('user-saved', '.is-user-observer')
  saveUser () {
    this.save(this.user)
  }
}
```

In the above, when you call `saveUser` method, it publishes `user-saved` event to its descendant `.is-user-observer` elements.

For example, if the dom tree is like the below:

```
<div class="component">
  <input class="is-user-observer">
  <label class="is-user-observer"></label>
</div>
```

When `saveUser` is called, then `input` and `label` elements get `user-saved` event and they can react to the change of the data `user`.

This decorator is useful for applying [flux][] design pattern to capsid components.

# Plugins

## jQuery Plugin

Capsid jQuery plugin is the integration of jQuery with capsid.

### Install

via npm:

```js
const capsidJQuery = require('capsid/jquery')
```

via CDN:

```html
<script src="https://unpkg.com/capsid/dist/capsid-jquery.min.js"></script>
```

To use Capsid jQuery plugin via npm, do the following:

```js
const $ = require('jquery')
const capsid = require('capsid')

require('capsid/jquery')(capsid, $) // This appends jquery plugin functions to capsid
```

Then, your components automatically have `this.$el` property and it points the dom element wrapped by jQuery.

If you use capsid jquery plugin via CDN:

```
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-jquery.js"></script>
```

This automatically adds jQuery plugin functions to capsid.

The hello world example with jQuery plugin is like the below:

```html
<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-jquery.js"></script>
<script>
class Hello {
  __mount__ () {
    this.$el.text('Hello, world!')
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

[See the demo at Codepen](https://codepen.io/kt3k/pen/eRXQxg)

### Plugin APIs

- `$dom.cc(name)`
  - Initializes the element as a component.
- `$dom.cc.get(name)`
  - Gets the coelement of the element.
- `@wire.$el('.selector') get $subElems ()` decorator
  - Selects the elements with jquery by the given selector.

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

```js
$('<div class="timer modal"/>').cc().appendTo('body')
```

The above example is the same as the previous one.

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

### `@wire.$el(selector) get $getter ()`

- @param {string} selector The selector to select subelements

Wires the getter to the elements selected by jquery with the given selector.

Example:
```js
class Mirroring {
  @wire.$el('.mirror-src') get $src () {}
  @wire.$el('.mirror-dest') get $dest () {}

  @on('input') onInput () {
    this.$dest.text(this.$src.val())
  }
}

def('mirroring', Mirroring)
```

```html
<div class="mirroring">
  <input class="mirror-src" />
  <br />
  <span class="mirror-dest"></span>
</div>
```

[See demo on Codepen](https://codepen.io/kt3k/pen/mwgWXN?editors=1010)

## Debug plugin

`debug plugin` outputs information useful for debugging capsid app.

### Install

Via npm:

```js
require('capsid/debug') // need to be before capsid load
```

Via CDN:

```html
<script src="https://unpkg.com/capsid/dist/capsid-debug.js"></script>
```

(Note: the script above needs to be loaded **before** capsid.js)

And you'll get additional debug information in console.

<img src="http://capsidjs.github.io/capsid/asset/ss-debug.png" />

## Outside Events Plugin

### Install

Via npm:

```js
const capsid = require('capsid')
require('capsid/outside-events')(capsid)
```

Via cdn:

```html
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-outside-events.js"></script>
```

With `outside-events-plugin`, you can bind methods to events *outside* of your coponent's element. (This event need to bubble up to `document`)

```js
@component('modal')
class Modal {
  @on.outside('click')
  close () {
    this.el.classList.remove('is-shown')
  }

  open () {
    this.el.classList.add('is-shown')
  }
}
```

The above `modal` component gets `is-shown` class removed from the element when the outside of modal is clicked.

#### prior art

- [jQuery outside events](https://github.com/cowboy/jquery-outside-events)
- [react-onclickoutside](https://github.com/Pomax/react-onclickoutside)

# History

- 2018-08-07   v0.26.1  Fix bug of unmount and on handler.
- 2018-07-12   v0.26.0  Add debug log contents.
- 2018-06-22   v0.25.0  Add `@on.useHandler`.
- 2018-06-22   v0.24.0  Add `@on.click.at`.
- 2018-05-20   v0.23.5  Fix unmount bug.
- 2018-04-18   v0.23.4  Fix unmount bug.
- 2018-04-10   v0.23.0  Change debug format.
- 2018-04-09   v0.22.0  Rename __init__ to __mount__.
- 2018-04-08   v0.21.0  Add `unmount`.
- 2018-04-04   v0.20.3  Change initialized class name.
- 2018-03-08   v0.20.0  Add install function.
- 2017-12-31   v0.19.0  Add wired, wired.all and wired.component decorators.
- 2017-12-05   v0.18.3  Add an error message.
- 2017-10-12   v0.18.0  Add Outside Events plugin.
- 2017-10-01   v0.17.0  Add Debug plugin.
- 2017-09-09   v0.16.0  Rename `@emit` to `@emits` and `@pub` to `@notifies`
- 2017-09-06   v0.15.1  Change component init sequence.
- 2017-09-05   v0.15.0  Add `mount` API. Remove `init` API.
- 2017-08-04   v0.14.0  Make `@on` listeners ready at __init__ call.
- 2017-08-03   v0.13.0  Add pub decorator.
- 2017-07-15   v0.12.0  Add wire.$el and wire.elAll to jquery plugin.
- 2017-07-13   v0.11.0  Add wire.el and wire.elAll.
- 2017-07-11   v0.10.0  Add emit.first rename emit.last to emit.
- 2017-07-10   v0.9.0   Add on.click shorthand.
- 2017-03-01   v0.8.0   Modify init sequence.
- 2017-02-26   v0.7.0   Add static capsid object to each coelement class.
- 2017-02-26   v0.6.0   static __init__ rule.
- 2017-02-25   v0.5.0   coelem.capsid, initComponent APIs.
- 2017-01-19   v0.3.0   API reorganization.
- 2017-01-19   v0.2.2   Rename to capsid.
- 2017-01-17   v0.1.1   Add plugin system.

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

The projects which uses capsid.

- [todomvc](https://github.com/capsidjs/todomvc)
  - [TodoMVC](http://todomvc.com/) in capsid.
- [multiflip](https://github.com/kt3k/multiflip)
- [multiflip-bubble](https://github.com/kt3k/multiflip-bubble)
- [puncher](https://github.com/kt3k/puncher)
- [event-hub](https://github.com/capsidjs/event-hub)
- [spn](https://github.com/kt3k/spn)
- [view-todo](https://github.com/kt3k/view-todo)
- [pairs](https://github.com/kt3kstudio/pairs)
  - Pairs is the primary user project and inspiration source of capsid.
  - capsid is basically created for developing this project.

# Notes

## The name

> capsid /ˈkapsəd/ n.
>
> the protein coat or shell of a virus particle, surrounding the nucleic acid or nucleoprotein core.

The purpose of capsid is to encapsulate the details of its contents just like capsid for virus cells. Its has the same origin *capsa* ("box" in Latin) as the word *capsule*.

## The name 'coelement'

`co-` means the dual or the other aspect of something like `cosine` to `sine` `cotangent` to `tangent` etc. Coelement is the other aspect of `element` and it works together in the 1-to-1 relationship and in the same lifecycle with the element.

# (possibly) similar projects

- [DOM99](https://github.com/GrosSacASac/DOM99)
- [RE:DOM](https://redom.js.org/)
- [butterknife](https://github.com/JakeWharton/butterknife)
  - `butterknife` is a library for Android development. The syntax and some ideas are similar to capsid.

# Examples

- :wave: [Hello Example][]
- :stopwatch: [Clock Example][]
- :level_slider: [Counter Example][]
- :butterfly: [Mirroring Example][]
- [Random Walking Particles Example][]

# License

MIT

[flux]: http://facebook.github.io/flux
[evex]: http://github.com/capsidjs/evex
[Hello Example]: https://codepen.io/kt3k/pen/MmYxBB?editors=1010
[Clock Example]: https://codepen.io/kt3k/pen/YVPoWm?editors=1010
[Counter Example]: https://codepen.io/kt3k/pen/KorYPr?editors=1010
[Mirroring Example]: https://codepen.io/kt3k/pen/VbvKNp?editors=1010
[DOMContentLoaded]: https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
[Random Walking Particles Example]: https://codepen.io/kt3k/pen/opWJVx
[capsid-module]: https://github.com/capsidjs/capsid-module
