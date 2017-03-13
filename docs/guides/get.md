# Get components dynamically

You can get the coelement instance dynamically using [get](../api/core.md#get) method.

```js
const { get } = capsid

// This gets Timer class instance.
const timer = get('timer', document.querySelector('.timer'))
```

It throws an error when the given component name is not registered or not available at the element.

```js
// This throws!
get('not-exist', document.querySelector('#the-item'))
```
