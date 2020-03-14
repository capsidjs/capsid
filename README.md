<img src="http://capsidjs.github.io/capsid/asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/capsidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://codecov.io/github/capsidjs/capsid?branch=master)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)
![size](https://img.badgesize.io/capsidjs/capsid/master/dist/capsid.min.js.svg?compression=gzip&)

> :pill: Component-based DOM programming

`capsid` is a library for component-based DOM programming.

`capsid` gives behaviors to the classes of html elements based on the component definitions. See [Hello Example][] :wave: or [Clock Example][] :stopwatch:.

`capsid` uses decorators for defining event handlers and event emitters declaratively. See [Mirroring Example][] :butterfly: and [Counter Example][] :level_slider:.

For state management, `capsid` has [evex][], which is the variation of [flux][] design pattern by using DOM events. Please check [evex][] repository for details.

# :sparkles: Features

- **Component-based DOM programming library**
- :leaves: **Small.** ![size](https://img.badgesize.io/capsidjs/capsid/master/dist/capsid.min.js.svg?compression=gzip&), No dependencies.
- :bulb: **Sensible.** It gives **behaviors** (event handlers and lifecycles) to **html classes** based on **component** definition.
- :sunny: **Declarative.** You usually need only **5** decorators `@component`, `@wired`, `@on`, `@emits`, and `@notifies` to build an app.

# :butterfly: [Mirroring Example][]

The mirroring example shows the basic usages of `@component`, `@wired`, and `@on` decorators.

```js
const { on, wired, component } = require("capsid");

@component("mirroring") // This registeres the class as a capsid component
class Mirroring {
  @wired(".dest") // This decorator makes the field equivalent of `get dest () { return this.el.querySelector('.dest'); }`
  dest;
  @wired(".src")
  src;

  @on("input") // This decorator makes the method into an event listener on the mounted element
  onReceiveData() {
    this.dest.textContent = this.src.value;
  }
}
```

```html
<div class="mirroring">
  <p>
    <input class="src" placeholder="Type something here" />
  </p>
  <p class="dest"></p>
</div>
```

`@component("mirroring")` registers the following class as the component `mirroring`.

`@wired` wires the element of the selector to the fields. `@on("input")` declares the following method is the `input` event handler. In the event handler `src` value is copied to `dest` content, which results the mirroring of the input values to the textContent of `.dest` paragraph.

[See the demo][Mirroring Example]

# :wave: [Hello Example][]

The hello example shows the usage of `__mount__` lifecycle:

```ts
import { component } from "capsid";

@component("hello")
export class Hello {
  el: HTMLElement;
  __mount__() {
    this.el.textContent = "Hello, world!";
  }
}
```

```html
<span class="hello"></span>
```

`@component` defines the `hello` component.

When the component initialized, `__mount__` method is called and in this case `textContent` of the element becomes `Hello, world!`.

[See the demo][Hello Example]

# :cd: Install

## Via npm

    npm install --save capsid

then:

```js
const capsid = require('capsid')
```

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

# Capsid Lifecycle

nothing -> [mount] -> component works -> [unmount] -> nothing

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

Coelement is the instance of Component class, which is attached to html element. You can get coelement from the element using `get` API.

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
  - installs the capsid module with the given options.

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

const div = document.createElement('div')

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
  notifies,
  is
} = require('capsid')
```

There are 6 types of decorators.

- `@component(name)`
  - *class decorator*
  - registers as a capsid components.
- `@on(event, { at })`
  - *method decorator*
  - registers as an event listener on the component.
  - `@on.click` is a shorthand for `@on('click')`.
  - `@on.click.at(selector)` is a shorthand for `@on('click', { at: selector })`.
- `@emits(event)`
  - *method decorator*
  - makes the decorated method an event emitter.
- `@wired(selector)`
  - *field decorator*
  - wires the elements to the decorated field by the given selector.
  - optionally `@wired.all(selector)`
- `@notifies`
  - *method decorator*
  - makes the decorated method an event broadcaster.
- `@is`
  - *class decorator*
  - Adds the class name to the given element.

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

## `@emits(eventName)`

`@emits(eventName)` triggers the event at the end of the method.

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

If the method returns a promise, then the event is triggered _after_ the promise is resolved.

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

## @wired(selector) field

- @param {string} selector The selector to look up the element in the component

This wires the decorated field to the element selected by the given selector. The wired element is a unusal dom element (HTMLElement), not a capsid component instance.

If the selector matches to the multiple elements, then the first one is used.

## @wired.all(selector) field

- @param {string} selector The selector to look up the elements in the component

This wires the decorated field to the all elements selected by the given selector. This is similar to `@wired` decorator, but it wires all the elements, not the first one.

## @notifies(event, selector)

- @param {string} event The event type
- @param {string} selector The selector to notify events

`@notifies` is a method decorator. It adds the function to publishes the event to its descendant elements at the end of the decorated method.

```js
@component('foo')
class Component {
  @notifies('user-saved', '.is-user-observer')
  saveUser () {
    this.save(this.user)
  }
}
```

In the above, when you call `saveUser` method, it publishes `user-saved` event to its descendant `.is-user-observer` elements.

For example, if the dom tree is like the below:

```html
<div class="component">
  <input class="is-user-observer">
  <label class="is-user-observer"></label>
</div>
```

When `saveUser` is called, then `input` and `label` elements get `user-saved` event and they can react to the change of the data `user`.

This decorator is useful for applying [flux][] design pattern to capsid components.

## `@is(...classNames: string[])`

Adds the given class names to the element when it's mounted.

```ts
@component('foo')
@is('bar-observer')
class Foo {
}

make('foo', document.body)

body.classList.contains('bar-observer')
// => true
```

This decorator is useful when a component has several different roles. You can adds the role of the component by specifying `@is('class-name')`.

# Plugins

## Debug plugin

`debug plugin` outputs information useful for debugging capsid app.

### Install

Via npm:

```js
const capsid = require('capsid')
capsid.install(require('capsid/debug'))
```

Via CDN:

```html
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-debug.js"></script>
<script>capsid.install(capsidDebugPlugin)</script>
```

And you'll get additional debug information in console.

<img src="http://capsidjs.github.io/capsid/asset/ss-debug.png" />

## Outside Events Plugin

### Install

Via npm:

```js
const capsid = require('capsid')
capsid.install(require('capsid/outside-events'))
```

Via cdn:

```html
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-outside-events.js"></script>
<script>
capsid.install(capsidOutsideEventsPlugin)
</script>
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

#### prior art of capsid outside plugin

- [jQuery outside events](https://github.com/cowboy/jquery-outside-events)
- [react-onclickoutside](https://github.com/Pomax/react-onclickoutside)

# History

- 2020-03-14   v1.2.0   Add `@is` decorator.
- 2020-03-13   v1.1.0   Add type declaration.
- 2020-03-12   v1.0.0   Support TypeScript decorators. Drop babel decorators support.
- 2019-06-09   v0.29.2  Throw error when empty selector is given (`@notifies`)
- 2018-12-01   v0.29.0  Switch to TypeScript.
- 2018-11-22   v0.28.0  Switch to new decorator. Remove jquery-plugin.
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

# Examples

- :wave: [Hello Example][]
- :stopwatch: [Clock Example][]
- :level_slider: [Counter Example][]
- :butterfly: [Mirroring Example][]

# License

MIT

[flux]: http://facebook.github.io/flux
[evex]: http://github.com/capsidjs/evex
[Hello Example]: https://codesandbox.io/s/hello-world-capsidjs-example-k5dgl
[Clock Example]: https://codesandbox.io/s/clock-capsidjs-example-i9d7k
[Counter Example]: https://codesandbox.io/s/km023p21nv
[Mirroring Example]: https://codesandbox.io/s/p7m3xv3mvq
[DOMContentLoaded]: https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
[capsid-module]: https://github.com/capsidjs/capsid-module
