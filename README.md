# class-component.js v5.2.0 [![Build Status](https://travis-ci.org/kt3k/class-component.svg?branch=master)](https://travis-ci.org/kt3k/class-component)

> Framework to define reusable HTML class component

***note*** This library depends on jQuery and is jQuery plugin


## How to use

Through npm

```js
global.jQuery = require('jquery');
require('class-component');
```

Through bower

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```


## Class Component

What is a class component?

A class component is a HTML element which has the special functionality (called coelement) according to its `class` attribute.

### Background

It's been a common technique in frontend development to bind some handlers to the specific HTML classes like the following.

```js
$('.foo').on('click', someProcess);
```

In the above, `.foo` class has the special functionality of peforming `someProcess` on click on it. What `class component` does is very similar as the above but it cares a bit more about the timing of initialization or the prevention of the double initialization.

It may be similar to [Custom Element](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/) in the basic idea but `class component` is based on html class and doesn't require any new API.


## APIs

```js
/**
 * @param {String} name The name
 * @param {Function} definingFunction The defining function
 */
$.cc.register(name, definingFunction);
```

This registers a "class component" of the given name using the given defining function.
The given defining function is called only once on an element of the given class name at `$(document).ready` timing.
The defining function takes one arugment which is jquery object of the element. This function is called only once for each class component element.

If you want to add class component elements after `$(document).ready` timing, you can initialize them by calling `$.cc.init('class-name')`, which initializes all class components on the page. The double initialization is automatically prevented by the framework.

See the [DEMO](http://kt3k.github.io/class-component/test.html).


---

```js
/**
 * @param {String} name The name of the class component
 * @param {HTMLElement|null} elem The element in which the class components are initialized
 */
$.cc.init(name, elem);
```

`$.cc.init` initializes the class components `name` in `elem`. If `elem` is omitted, then the elements in the whole page are initialized. If `name` is omitted, then all registered class components are initialized.


## Examples

Download button

js

```js
$.cc.register('download', function (elem) {

    elem.click(function () {

        window.open(elem.attr('url'), '_blank');

    });

});
```

html
```html
<button class="download" url="http://url/to/dl-target">DL</button>
```

When you click the above button, new window opens and starts downloading it.

---

Hover element

js

```js
$.cc.register('my-anchor', function (elem) {

    elem.on('click', function () {

        location.href = elem.attr('href');

    });

    elem.on('mouseover', function () {

        elem.addClass('hover');

    });

    elem.on('mouseout', function () {

        elem.removeClass('hover');

    });

});
```

html
```html
<div class="my-anchor" href="https://www.google.com/">...</div>
```

When you click the above div, the page goes to href's url (https://www.google.com/ in this case) and when you mouse over it, it gets `.hover` class.


## Coelement

Coelement is a kind of classes which accompanies the element to modify its behaviour.

js
```js
var Foo = function (elem) {

    this.elem = elem;

};

Foo.prototype.doSomething = function () {
    // ...
};

$.assign('foo', Foo);
```

html
```html
<div class="foo"></div>
```

In the above, when the page is loaded, Foo class is initialized with `div.foo` and its accompanies the div. The accompanying coelement can be obtained by calling `dom.cc.get('foo')` in this case.


----

```js
/**
 * @param {String} className The class name
 * @param {Function} constructor The coelement class constructor
 */
$.cc.assign(className, constructor);
```

`$.cc.assign` is similar to the `$.cc.register`. It registers the class component of the given name, but the second argument is not just called but called as the constructor and its instance becomes the accompanying coelement. The coelement can be accessed by calling `elem.cc.get('className')`.

----

Dynamic creation

```js
$('<div />').cc.init('foo');
```

`$.fn.cc.init` helps to create the class component. In the above example, `div` becomes `div.foo` and turns into `foo` class component. If the `foo` class component has coelement, then `elem.cc.init('foo')` returns coelement. In this case, you can call like `$('<div />').cc.init('foo').doSomething()`.

## Example components

- [event-hub](https://github.com/kt3k/event-hub)
- [event-twister](https://github.com/kt3k/event-twister)

## License

MIT
