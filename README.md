<img src="http://capsidjs.github.io/capsid/asset/capsid.svg" />

[![ci](https://github.com/capsidjs/capsid/actions/workflows/ci.yml/badge.svg)](https://github.com/capsidjs/capsid/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)

- **Declarative DOM programming library based on TypeScript decorators**
- :leaves: **Small.** **1.8 kb**, **No
  dependencies**.
- :sunny: **No special syntax.** Capsid uses standard HTML and TypeScript.
  No need of learning any non-standard syntax like JSX, Vue, Svelte, etc.
- :bulb: **Simple.** No virtual DOMs. Capsid encourages the traditional event
  driven programming in a new style.

`capsid` uses TypeScript decorators for event handlers and dispatchers, and it
enables declarative style of DOM programming. See
[Mirroring Example][Mirroring Example] :butterfly: and
[Counter Example][Counter Example] :level_slider:.

# :butterfly: [Mirroring Example][Mirroring Example]

The mirroring example shows the basic usages of `@component`, `@wired`, and
`@on` decorators.

```ts
import { on, wired, component } import "capsid";

// Declares `mirroring` component.
// HTML elements which have `mirroring` class will be mounted by this component.
@component("mirroring")
class Mirroring {
  // Wires `dest` property to dom which is selected by `.dest` selector.
  @wired(".dest")
  dest!: HTMLParagraphElement;

  // Wires `src` property to dom which is selected by `.src` selector.
  @wired(".src")
  src!: HTMLInputElement;

  // Declares `input` event listener
  @on("input")
  onReceiveData() {
    this.dest.textContent = this.src.value;
  }
}
```

```html
<div class="mirroring">
  <input class="src" />
  <p class="dest"></p>
</div>
```

`@component("mirroring")` registers the class as the component `mirroring`.

`@wired` binds a dom element to the field which is queried by the given
selector. `@on("input")` declares the following method is the `input` event
handler. In the event handler `src` value is copied to `dest` content, which
results the mirroring of the input values to the textContent of `.dest`
paragraph.

[See the demo][Mirroring Example]

# :cd: Install

## Via npm

    npm install --save capsid

then:

```js
import { component } from "capsid";
```

Note: You need TypeScript for using capsid because it depends on TypeScript
decorators. You can easily start using TypeScript by using bundlers like
[parcel][parcel]

# Decorators

```js
import { component, emits, innerHTML, is, on, pub, sub, wired } from "capsid";
```

- `@component(name)`
  - _class decorator_
  - registers as a capsid components.
- `@on(event, { at })`
  - _method decorator_
  - registers as an event listener on the component.
  - `@on.click` is a shorthand for `@on('click')`.
  - `@on.click.at(selector)` is a shorthand for
    `@on('click', { at: selector })`.
- `@emits(event)`
  - _method decorator_
  - makes the decorated method an event emitter.
- `@wired(selector)`
  - _field decorator_
  - wires the elements to the decorated field by the given selector.
  - optionally `@wired.all(selector)`
- `@is(name)`
  - _class decorator_
  - Adds the class name to the given element.
- `@innerHTML(html: string)`
  - _class decorator_
  - Sets the given html string as innerHTML of the element at the mount timing.
- `@pub(event: string, selector?: string)`
  - _methods decorator_
  - Publishes the event to the elements which have `sub:event` class.
- `@sub(event: string)`
  - _class decorator_
  - Adds the `sub:event` class to the given element.

## `@component(name: string)`

capsid.component(className) is class decorator. With this decorator, you can
regiter the js class as class component.

This is a shorthand of `capsid.def('component', Component)`.

```js
import { component } from 'capsid'

@component('timer')
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `timer` component.

## `@on(event: string)`

`@on` is a method decorator. With this decorator, you can register the method as
the event handler of the element.

```js
import { on, component } from 'capsid'

@component('foo-btn')
class FooButton {

  @on('click')
  onClick (e) {
    ...definitions...
  }
}
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

## `@on(event: string, { at }: { at: string })`

`@on(name, { at: selector })` is a method decorator. It's similar to `@on`, but
it only handles the event from `selector` in the component.

```js
import { on, component } from 'capsid'

@component('btn')
class Btn {
  @on('click', { at: '.btn' })
  onBtnClick (e) {
    ...definitions...
  }
}
```

In the above example, `onBtnClick` method listens to the click event of the
`.btn` element in the `Btn`'s element.

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

## `@on.click.at(selector: string)`

`@on.click.at(selector)` is a shorthand for `@on('click', { at: selector })`

```js
class Foo {
  @on.click.at(".edit-button")
  onClickAtEditButton() {
    // handling of the click of the edit button
  }
}
```

**NOTE:** You can add this type of short hand by calling
`on.useHandler(eventName)`.

```js
on.useHandler("change");

class Foo {
  @on.change.at(".title-input") // <= This is enabled by the above useHandler call.
  onChangeAtTitleInput() {
    // handles the change event of title input field.
  }
}
```

## `@emits(event: string)`

`@emits(eventName)` triggers the event at the end of the method.

```js
import { emits, component } from 'capsid'

@component('manager')
class Manager {
  @emits('manager.ended')
  start() {
    ...definitions...
  }
}
```

In the above example, `start` method triggers the `manager.ended` event when it
finished. The returns value of the method is passed as `detail` of the event
object. So you can pass the data from children to parents.

If the method returns a promise, then the event is triggered _after_ the promise
is resolved.

```js
const { emits, component } = require('capsid')

@component('manager')
class Manager {
  @emits('manager.ended')
  start () {
    ...definitions...

    return promise
  }
}
```

In the above example, `manager.ended` event is triggered after `promise` is
resolved. The resolved value of the promise is passed as `detail` of the event
object.

## `@wired(selector: string) field`

- @param {string} selector The selector to look up the element in the component

This wires the decorated field to the element selected by the given selector.
The wired element is a unusal dom element (HTMLElement), not a capsid component
instance.

If the selector matches to the multiple elements, then the first one is used.

## `@wired.all(selector: string) field`

- @param {string} selector The selector to look up the elements in the component

This wires the decorated field to the all elements selected by the given
selector. This is similar to `@wired` decorator, but it wires all the elements,
not the first one.

## `@is(...classNames: string[])`

Adds the given class names to the element when it's mounted.

```ts
@component("foo")
@is("bar-observer")
class Foo {
}

make("foo", document.body);

document.body.classList.contains("bar-observer");
// => true
```

This decorator is useful when a component has several different roles. You can
adds the role of the component by specifying `@is('class-name')`.

## `@innerHTML(html: string)`

Sets the given html string as the innerHTML of the element at mount timing.

```ts
@component("foo")
@innerHTML(`
  <p>hello</p>
`)
class Foo {
}

make("foo", document.body);

document.body.innerHTML;
// => <p>hello</p>
```

## `@pub(event: string)`

The method dispatches the `event` to the elements which have `sub:{event}`
class. For example, if the method has `@pub('foo')`, then it dispatches `foo`
event to the elements which have `sub:foo` class. The dispatched events don't
buble up the dom tree.

```ts
@component("my-comp")
class MyComp {
  @pub("foo")
  method() {
    // something ...
  }
}
```

The returned value or resolved value of the decorator becomes the `detail` prop
of the dispatched custom event.

## `@pub(event: string, selector: string)`

The method dispatches `event` to the given `selector`.

```ts
@component("my-comp")
class MyComp {
  @pub("foo", "#foo-receiver")
  method() {
    // something ...
  }
}
```

## `@sub(event: string)`

This class decorator adds the `sub:event` class to the given component. For
example if you use `@sub('foo')`, the component have `sub:foo` class, which
means this class becomes the subscriber of `foo` event in combination with
`@pub('foo')` decorator.

```ts
@component("my-comp")
@sub("foo")
class MyComp {
  @on("foo")
  handler() {
    // ... do something
  }
}
```

# APIs

These are advanced APIs of capsid. You usually don't need these APIs for
building an app, but these could be useful if you write capsid plugins or
reusable capsid modules. These APIs are used for building decorators of capsid.

```js
import { def, get, install, make, mount, prep, unmount } from "capsid";
```

- `def(name, constructor)`
  - Registers class-component.
- `prep([name], [element])`
  - Initialize class-component on the given range.
- `make(name, element)`
  - Initializes the element with the component of the given name and return the
    coelement instance.
- `mount(Constructor, element)`
  - Initializes the element with the component of the given class and return the
    coelement.
- `unmount(name, element)`
  - unmount the component from the element by its name.
- `get(name, element)`
  - Gets the coelement instance from the given element.
- `install(capsidModule, options)`
  - installs the capsid module with the given options.

## `def(name, constructor)`

- @param {string} name The class name of the component
- @param {Function} constructor The constructor of the coelement of the
  component

This registers `constructor` as the constructor of the coelement of the class
component of the given name `name`. The constructor is called with a jQuery
object of the dom as the first parameter and the instance of the coelement is
attached to the dom. The instance of coelement can be obtained by calling
`elem.cc.get(name)`.

Example:

```js
class TodoItem {
  // ...behaviours...
}

capsid.def("todo-item", TodoItem);
```

```html
<li class="todo-item"></li>
```

## `prep([name], [element])`

- @param {string} [name] The capsid component name to intialize
- @param {HTMLElement} [element] The range to initialize

This initializes the capsid components of the given name under the given
element. If the element is omitted, it initializes in the entire page. If the
name is omitted, then it initializes all the registered class components in the
given range.

## `make(name, element)`

- @param {string} name The capsid component name to initialize
- @param {HTMLElement} element The element to initialize
- @return {<Component>} created coelement

Initializes the element as the capsid component and returns the coelement
instance.

```js
const timer = make("timer", dom);
```

## `mount(Constructor, element)`

- @param {Function} Constructor The constructor which defines the capsid
  component
- @param {HTMLElemen} element The element to mount the component
- @return {<Constructor>} The created coelement

Initializes the element with the component of the given class and return the
coelement.

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

Usually you don't need to use this API. If you're writing library using capsid,
you might sometimes need to create an unnamed component and need this API then.

## `unmount(name, element)`

- @param {string} name The component name
- @param {HTMLElement} element The element

Unmounts the component of the given name from the element.

Example:

```js
@component("foo")
class Foo {
  @on("input")
  remove() {
    unmount("foo", this.el);
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
const timer = capsid.get("timer", el);
```

The above gets timer coelement from `el`, which is instance of `Timer` class.

### `install(capsidModule[, options])`

- @param {CapsidModule} capsidModule The module to install
- @param {Object} options The options to pass to the module

This installs the capsid module.

```js
capsid.install(require("capsid-popper"), { name: "my-app-popper" });
```

See [capsid-module][capsid-module] repository for details.

# Plugins

## Debug plugin

`debug plugin` outputs information useful for debugging capsid app.

### Install

Via npm:

```js
import { install } from "capsid";
import debug from "capsid/debug";
install(debug);
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
import { install } from "capsid";
import outside from "capsid/outside";
install(outside);
```

Via cdn:

```html
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-outside-events.js"></script>
<script>
capsid.install(capsidOutsideEventsPlugin)
</script>
```

With `outside-events-plugin`, you can bind methods to events _outside_ of your
coponent's element. (This event need to bubble up to `document`)

```js
@component("modal")
class Modal {
  @on.outside("click")
  close() {
    this.el.classList.remove("is-shown");
  }

  open() {
    this.el.classList.add("is-shown");
  }
}
```

The above `modal` component gets `is-shown` class removed from the element when
the outside of modal is clicked.

#### prior art of capsid outside plugin

- [jQuery outside events](https://github.com/cowboy/jquery-outside-events)
- [react-onclickoutside](https://github.com/Pomax/react-onclickoutside)

# Initialization

There are 2 ways to initialize components:

1. [When document is ready][DOMContentLoaded] (automatic).
2. When `capsid.prep()` is called (manual).

All components are initialized automatically when document is ready. You don't
need to care about those elements which exist before document is ready. See
[Hello Example][Hello Example] or [Clock Example][Clock Example] for example.

If you add elements after document is ready (for example, after ajax requests),
call `capsid.prep()` and that initializes all the components.

```js
const addPartOfPage = async () => {
  const { html } = await axios.get('path/to/something.html')

  containerElemenent.innerHTML = html

  capsid.prep() // <= this initializes all the elements which are not yet initialized.
})
```

# Capsid Lifecycle

Capsid has 2 lifecycle events: `mount` and `unmount`.

```
nothing -> [mount] -> component mounted -> [unmount] -> nothing
```

## Lifecycle events

- `mount`
  - HTML elements are mounted by the components.
  - An element is coupled with the corresponding coelement and they start
    working together.

- `unmount`
  - An element is decouple with the coelement.
  - All events are removed and coelement is discarded.
  - You need to call `unmount(class, element)` to trigger the unmount event.

## Explanation of `mount`

At `mount` event, these things happen.

- The component class's `instance` (coelement) is created.
- `instance`.el is set to corresponding dom element.
- `before mount`-hooks are invoked.
  - This includes the initialization of event handlers, class names, innerHTML,
    and custom plugin's hooks.
- if `instance` has **mount** method, then `instance.__mount__()` is called.

The above happens in this order. Therefore you can access `this.el` and you can
invoke the events at `this.el` in `__mount__` method.

## Lifecycle Methods

### `constructor`

The constructor is called at the start of `mount`ing. You cannot access
`this.el` here. If you need to interact with `this.el`, use `__mount__` method.

### `__mount__`

`__mount__()` is called at the **end** of the mount event. When it is called,
the dom element and event handlers are ready and available through `this.el`.

### `__unmount__`

`__unmount__()` is called when component is unmounted. If your component put
resources on global space, you should discard them here to avoid memory leak.

# Coelement

Coelement is the instance of Component class, which is attached to html element.
You can get coelement from the element using `get` API.

# History

- 2020-04-02 v1.7.0 Better make/get/unmount types.
- 2020-03-30 v1.6.2 Fix submodule export for TypeScript.
- 2020-03-28 v1.6.1 Fix debug plugin.
- 2020-03-28 v1.6.0 Automatic intialization of components inside `@innerHTML`.
- 2020-03-21 v1.5.0 Extend `@pub` decorator and remove `@notifies`.
- 2020-03-21 v1.4.0 Add `@innerHTML` decorator.
- 2020-03-15 v1.3.0 Add `@pub` and `@sub` decorators.
- 2020-03-14 v1.2.0 Add `@is` decorator.
- 2020-03-13 v1.1.0 Add type declaration.
- 2020-03-12 v1.0.0 Support TypeScript decorators. Drop babel decorators
  support.
- 2019-06-09 v0.29.2 Throw error when empty selector is given (`@notifies`)
- 2018-12-01 v0.29.0 Switch to TypeScript.
- 2018-11-22 v0.28.0 Switch to new decorator. Remove jquery-plugin.
- 2018-08-07 v0.26.1 Fix bug of unmount and on handler.
- 2018-07-12 v0.26.0 Add debug log contents.
- 2018-06-22 v0.25.0 Add `@on.useHandler`.
- 2018-06-22 v0.24.0 Add `@on.click.at`.
- 2018-05-20 v0.23.5 Fix unmount bug.
- 2018-04-18 v0.23.4 Fix unmount bug.
- 2018-04-10 v0.23.0 Change debug format.
- 2018-04-09 v0.22.0 Rename **init** to **mount**.
- 2018-04-08 v0.21.0 Add `unmount`.
- 2018-04-04 v0.20.3 Change initialized class name.
- 2018-03-08 v0.20.0 Add install function.
- 2017-12-31 v0.19.0 Add wired, wired.all and wired.component decorators.
- 2017-12-05 v0.18.3 Add an error message.
- 2017-10-12 v0.18.0 Add Outside Events plugin.
- 2017-10-01 v0.17.0 Add Debug plugin.
- 2017-09-09 v0.16.0 Rename `@emit` to `@emits` and `@pub` to `@notifies`
- 2017-09-06 v0.15.1 Change component init sequence.
- 2017-09-05 v0.15.0 Add `mount` API. Remove `init` API.
- 2017-08-04 v0.14.0 Make `@on` listeners ready at **init** call.
- 2017-08-03 v0.13.0 Add pub decorator.
- 2017-07-15 v0.12.0 Add wire.$el and wire.elAll to jquery plugin.
- 2017-07-13 v0.11.0 Add wire.el and wire.elAll.
- 2017-07-11 v0.10.0 Add emit.first rename emit.last to emit.
- 2017-07-10 v0.9.0 Add on.click shorthand.
- 2017-03-01 v0.8.0 Modify init sequence.
- 2017-02-26 v0.7.0 Add static capsid object to each coelement class.
- 2017-02-26 v0.6.0 static **init** rule.
- 2017-02-25 v0.5.0 coelem.capsid, initComponent APIs.
- 2017-01-19 v0.3.0 API reorganization.
- 2017-01-19 v0.2.2 Rename to capsid.
- 2017-01-17 v0.1.1 Add plugin system.

# History of class-component.js (former project)

- 2017-01-02 v13.0.0 Add **init** instead of init.
- 2017-01-01 v12.1.1 Fix bug of event bubbling.
- 2017-01-01 v12.1.0 Remove @emit.first. Use native dispatchEvent.
- 2016-12-31 v12.0.0 Remove **cc_init** feature. Add init feature.
- 2016-09-30 v10.7.1 Refactor @emit.last decorator
- 2016-09-11 v10.7.0 Add @on(event, {at}) @emit.first and @emit.last
- 2016-08-22 v10.6.2 Refactor the entrypoint.
- 2016-08-22 v10.6.1 Improved the event listener registration process.
- 2016-08-20 v10.6.0 Cleaned up some private APIs.
- 2016-08-20 v10.5.0 Cleaned up codebase and made the bundle smaller. Remove
  some private APIs.
- 2016-08-17 v10.4.1 Made built version smaller.
- 2016-08-16 v10.4.0 Switched to babel-preset-es2015-loose.
- 2016-08-16 v10.3.0 Modified bare @wire decorator.
- 2016-08-02 v10.2.0 Added bare @component decorator.
- 2016-07-21 v10.1.0 Added @wire decorator.
- 2016-06-19 v10.0.0 Removed deprecated decorators `@event` and `@trigger`, use
  `@on` and `@emit` instead.
- 2016-06-09 v9.2.0 Fixed bug of `@emit().last` decorator.

# Examples

- :wave: [Hello Example][Hello Example]
- :stopwatch: [Clock Example][Clock Example]
- :level_slider: [Counter Example][Counter Example]
- :butterfly: [Mirroring Example][Mirroring Example]

- [todomvc2](https://github.com/capsidjs/todomvc2)
  - [TodoMVC](http://todomvc.com/) in capsid.

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
[parcel]: https://parceljs.org/
