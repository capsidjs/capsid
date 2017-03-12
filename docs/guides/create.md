# Create components dynamically

You can create components dynamically by [init](../api/core.md#init) and [make](../api/make.md#make) methods.

```js
const el = document.createElement('span')

init('timer', el)
```

This makes `el` a `timer` component.

---

```js
const el = document.createElmement('span')

const timer = make('timer', el)
```

This make `el` a `timer` component and the returned value of `make()` call is a timer [coelement][coelement] instance. So you can call the `timer`'s method directly through it.

[coelement]: ../basics/component.md
