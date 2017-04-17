# <img src="asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/capsidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://codecov.io/github/capsidjs/capsid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/capsidjs/capsid/badges/score.svg)](https://www.bithound.io/github/capsidjs/capsid)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)
[![GitHub stars](https://img.shields.io/github/stars/capsidjs/capsid.svg?style=social&label=Star)](https://github.com/capsidjs/capsid)

> Class driven component framework

`capsid` is an UI framework for browsers. It helps organizing your JavaScript code in component-based programming style.

### The target users

`capsid` is a tool for someone who:

- wants to organize your code in **component-based** way.
- wants to **avoid** using **virtual-dom based** solutions like React, Vue etc.

If the above two apply to you, then `capsid` is a tool for you!

### Basic features

- It's an **UI framework**.
- Works well with **real** DOM APIs. Plays nice with `jQuery` or [Umbrella](https://umbrellajs.com/).
- **no virtual dom, no template, no rendering**
- **small APIs**: 6 apis & 4 decorators
- **small size**: **1.2KB** gzipped

### Install

Download [https://unpkg.com/capsid](https://unpkg.com/capsid) and load it in the page:

```html
<script src="https://unpkg.com/capsid"></script>
<script>
class Hello {
  __init__ () {
    this.el.textContent = 'Hello, world!'
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

[See the working demo](https://capsid.js.org/demo/hello.html) or [codepen](https://codepen.io/kt3k/pen/MmYxBB?editors=1010).

Or you can install via npm:

    npm install capsid --save-dev

And require `capsid` module:

```js
const { def } = require('capsid')

class Hello {...}

def('hello', HelloWorld)
```

**Note**: You need to set up webpack/browserify/rollup in the this case.

### License

MIT License
