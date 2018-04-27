# <img src="asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/ca
psidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://co
decov.io/github/capsidjs/capsid?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/capsidjs/capsid.svg)](https://greenkeeper.io
/)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/li
censes/MIT)

> Component-based DOM programming

`capsid` is a library for component-based DOM programming.

# :sparkles: Features

- **Component-based DOM programming library**
- :leaves: Lightweight: **~1.7KB**
- :sunglasses: **no dependencies**
- :sunny: **Plain JavaScript (+ ESNext decorators)**
- :bento: Adds **behaviors** (event handlers and lifecycles) to **classes** of elements based on
 **component** definition.
 - :lollipop: **7 APIs** & **5 decorators**

### Install

# :cd: Install

## Via npm

    npm install --save capsid

then:

```js
const capsid = require('capsid')
```

## Via file

Download [capsid.min.js](https://unpkg.com/capsid@0.23.4/dist/capsid.min.js) Then:

```html
<script src="path/to/capsid.js"></script>
```

In this case, the library exports the global variable `capsid`.

```js
capsid.def('my-component', MyComponent)
```

### License

MIT License
