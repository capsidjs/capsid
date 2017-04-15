# Event handling

In Capsid, you can declare component's event handlers using [@on](../api/decorators.md#on) decorator.

```js
class MyButton {
  @on('click')
  onClick (e) {
    alert('clicked!')
  }
}

capsid.def('my-button', MyButton)
```

```html
<button class="my-button">BUTTON</button>
```

[See the working example](https://capsidjs.github.io/capsid/demo/my-button.html).

`@on('click')` declares `onClick` method is the event handler of `click` event. Here, `@` is [decorators syntax](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) of *ESNext*.

You need to set up babel for using [babel-preset-decorators-legacy](https://npm.im/babel-plugin-transform-decorators-legacy).

    npm install --dev babel-preset-decorators-legacy

.babelrc:

```json
{
  presets: [
    "es2016",
    "decorators-legacy",
  ]
}
```

or using [babel-standalone](https://npm.im/babel-standalone):

```html
<script src="https://unpkg.com/babel-standalone" data-plugins="transform-decorators-legacy">
// You can use decorators here
</script>
```
