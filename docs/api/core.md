# Core APIs

## def

```js
const { def } = capsid

def(name, constructor)
```

- @param {string} name - The class name of the component
- @param {Function} constructor - The constructor of the coelement of the component

`def` registers the given `constructor` as the constructor of the coelement of the component of the given `name`. The constructor is called when the page is loaded or [prep](#prep) is called. The instance of the coelement is attached to the dom at the initialization. The instance of coelement can be obtained by calling [get](#get).

Example:

```html
<script src="https://unpkg.com/capsid"></script>
<script>
class TodoItem {

  __init__ () {
    // something
  }

  // etc
}

capsid.def('todo-item', TodoItem) // TodoItem class is registered as `todo-item` component
</script>

<!-- This automatically initializes as `todo-item` component -->
<li class="todo-item"></li>
```

## prep

```js
const { prep } = capsid

prep([name], [element])
```

- @param {string} [name] The class-component name to intialize
- @param {HTMLElement} [element] The range to initialize

`prep` initializes the components of the given name under the given element based on their class name. If the element is omitted, it initializes in the entire page. If the name is omitted, then it initializes all the registered class components in the given range.

For example if you have registered `timer` component and added `<span class="timer"></span>` dynamically, and then called `capsid.prep('timer')`, then the `<span>` above becomes timer component.

```js
$.get('url').then(data => {
  $('#main').html(data)

  capsid.prep() // This initializes all the appended elements in the page.
})
```

Or if you want to initialize only inside the affected element, you can specify the second argument.

```js
$.get('url').then(data => {
  $('#main').html(data)

  // This initializes all the components in `#main`
  capsid.prep(null, document.querySelector('#main'))
})
```

And if you know what kind of components are included in the fetched data, then you can specify the first argument.

```js
$.get('url').then(data => {
  $('#main').html(data)

  // This initializes only `foo-component`s in `#main`
  capsid.prep('foo-component', document.querySelector('#main'))
})
```

## init

```
const { init } = capsid

init(name, element)
```

- @param {string} name The component name to initialize
- @param {HTMLElement} element The element to initialize

`init` initializes the given element as the component of the given name. The difference from the prop is that `prep` initializes components based on the class names which the elements already have, but `init` force the given element to initialize as a component of the given name. In other word, `init` turns elements into the component, but `prep` doesn't.

```js
const el = document.createElement('span')

capsid.init('timer', el) // el becomes `timer` component.
```

The above initializes `el` as `timer` component.

## initComponent

- @param {Function} constructor The constructor which is used as a coelement constructor
- @param {HTMLElement} el The element to initialize
- @return {Object} created coelement instance

This is low level API.

`initComponent` initializes the given element by the given constructor, but it doesn't require class name and doesn't append 'name'`-initialized` class.

```js
const coelem = capsid.initComponent(LocalComponent, el)

coelem.something()
```

## get

```js
const { get } = capsid

get(name, element)
```

- @param {string} name The class-component name to get
- @param {HTMLElement} element The element
- @return The coelement instance

`get` gets the [coelement][coelement] instance from the element.

```js
const timer = capsid.get('timer', dom)
```

The above gets `Timer` class instance ([coelement][coelement]) from the element. The element needs to be initialized as `timer` component before this call.

## make

```js
const { make } = capsid

const instance = make(name, element)
```

- @param {string} name - The component name to initialize
- @param {HTMLElement} element - The element to initialize

`make` initializes the element as a component of the given name (the same as `init`) and returns the coelement instance. `make` is just a combination of [init](#init) and [get](#get).

```js
const el = document.createElement('span')

const timer = make('timer', el)
```

In the above, el becames timer and it returns the coelement instance.

[coelement]: ../basics/component.md
