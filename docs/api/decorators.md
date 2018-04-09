# Decorators

**Note**: All decorators depend on [babel-plugin-decorators-legacy](https://npm.im/babel-plugin-decorators-legacy) for now. This may change if the decorator proposal is changed and new decorator transform appears.

## @on

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

The above binds `onClick` method to its element's `click` event automatically.

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

### @on(event, { at: selector })

`@on(name, { at: selector })` is a method decorator. It's similar to `@on`, but it only handles the event from `selector` in the component. This is similar to the event delegate feature of jQuery.

```html
<script>
const { on } = capsid

class ControlPanel {

  @on('click', { at: '.btn' })
  onBtnClick (e) {
    ...definitions...
  }

}

capsid.def('control-panel', ControlPanel)
</script>

<div class="control-panel">
  <button class="btn"></button>
</div>
```

In the above example, `onBtnClick` method fires only when `.btn` element is clicked, not the entire `.control-panel` element.

## @emits.first

`@emits.first(name)` is a method decorator. This decorator makes the method trigger the given `name` event at the **start** of the method. (If you want to trigger event at the **end** of the method, use [@emits](#emits))

```html
<script>
const { emits, def } = require('capsid')

class Manager {

  @emits.first('manager-started')
  start () {
    ...definitions...
  }

}

def('manager', Manager)
</script>

<div class="manager"></div>

<script>
const manager = get('manager', document.querySelector('.manager'))

manager.start() // This triggers 'manager-started' event on `<div class="manager"></div>`.
</script>
```

The above `start` method automatically triggers `manager-started` event at the begining of the method process.

The above class definition is equivalent of:

```js
class Manager {

  start () {
    this.$el.trigger('manager-started', arguments)
    ...definitions...
  }

}

capsid.def('manager', Manager)
```

### @emits

`@emits(name)` is similar to `@emits.first()`, but it triggers the event at the **end** of the method.

```js
const { emits, def } = capsid

class Manager {

  @emits('manager-ended')
  end() {
    ...definitions...
  }

}

def('manager', Manager)
```

In the above example, `end` method triggers the `manager-ended` event when it finished. The returns value of the method is passed as the detail of the event object.

**Promise support**

If the method returns a **promise**, then the event is triggered after the promise is resolved.

```js
const { emits, def } = capsid

class Manager {

  @emits('manager-ended')
  start () {
    ...definitions...

    return promise
  }

}

def('manager', Manager)
```

In the above example, `manager-ended` event is triggered after `promise` is resolved. The resolved value of the promise is passed as the second argument of the event handler.

## @wire


## @component

This decorator registers the js class as the component of the same name. If the js class is in `CamelCase`, then the component name is in `kebab-case`.

```js
const { component } = require('capsid')

@component
class Timer { ... } // This registers Timer class as `timer` component

@component
class FooBar { ... } // This registers FooBar class as `foo-bar` component
```

### @component(name)

If you pass a string to `@component`, then it works as a different decorator.

`@component(name)` is class decorator which regiter the js class as a component of the given `name`.

This is a shorthand of `capsid.def('component', Component)`.

```js
const { component } = require('capsid')

@component('foo-timer') // This registers Timer class as `foo-timer` component.
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `foo-timer` component.

### @notifies(event, selector)

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

[flux]: http://facebook.github.io/flux
