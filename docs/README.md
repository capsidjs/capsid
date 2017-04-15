# <img src="asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/capsidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://codecov.io/github/capsidjs/capsid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/capsidjs/capsid/badges/score.svg)](https://www.bithound.io/github/capsidjs/capsid)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)

> Class driven component framework

`capsid` is an UI framework for browsers. It encourages the use of real dom programming and helps component-based encapsulation of behaviors of apps.

`capsid` is an UI framework for browsers. It helps the component based coding style with

### Basic features

- It's an **UI framework**.
- Works well with **real** DOM APIs. Plays nice with `jQuery` or `Umbrella`.
- **no virtual dom, no template, no rendering**
- **small APIs**: 6 apis & 4 decorators
- **small size**: **1.2KB** gzipped

### Install

Download [https://unpkg.com/capsid@0.8.1](https://unpkg.com/capsid@0.3.1) and load it in the page:

```html
<script src="path/to/capsid"></script>
<script>
class Hello {
  __init__ () {
    this.el.textContent = 'Hello, world!'
  }
}

capsid.def('hello', HelloWorld)
</script>

<span class="hello"></span>
```

[See working example](https://codepen.io/kt3k/pen/MmYxBB?editors=1010)

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

MIT
