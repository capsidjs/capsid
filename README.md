# class-component.js v3.0.1

> Utility to define reusable HTML class component

***note*** This library depends on jQuery.


## Class Component

What is a class component?

A class component is a HTML element which has the special functionality according to its `class` attribute.

### Background

It's a common technique in frontend development to bind handlers to the specific HTML classes like the following.

```js
$('.foo').on('click', someProcess);
```

In the above, `.foo` class has the special functionality of peforming `someProcess` on click on it. However this `.foo` isn't such reusable everywhere because the above doesn't care much about the timing of initialization and the prevention of the double initialization.

A class component is the reusable version of the above and you can use them everywhere you want. This library help defining such class components.

This idea is inspired by [Custom Element](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/) of Web Components.


## Doc

```js
/**
 * @param {String} name The name
 * @param {Function} definingFunction The defining function
 */
$.registerClassComponent(name, definingFunction);
```

This library expose the function `$.registerClassComponent(name, definingFunction)`.

This registers a "class component" of the given name using the given defining function.
The given defining function is called only once on an element of the given class name at `$(document).ready` timing.
The defining function takes one arugment which is jquery object of the element. This function is called only once for each class component element.

If you want to add class component elements after `$(document).ready` timing, you can initialize them by triggering `init-class.{class-name}` event on `document`, which automatically initializes all class component elements on the page. The initialization doesn't run twice on a element.

See the [DEMO](http://kt3k.github.io/class-component/test.html).

----

```
/**
 * Gets or sets the promise which resolves when the initializaion of the class component is ready.
 *
 * @param {String} className
 * @param {Promise} promise
 * @return {Promise}
 */
$.fn.classComponentReady(className, promise);
```

## Examples

```html
<script>

$.registerClassComponent('go-to-example-com', function (elem) {

    elem.click(function () {

        location.href = 'http://example.com/';

    });

});

</script>

<div class="go-to-example-com">...</div>
```

When you click the above div, the page go to the example.com.

----

```html
<script>

$.registerClassComponent('my-anchor', function (elem) {

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

</script>

<div class="my-anchor" href="https://www.google.com/">...</div>
```

This `.my-anchor` class is similar to `<a>`.

When you click the above div, the page goes to href's url (https://www.google.com/ in this case) and when you mouse over it, it gets `.hover` class.

## License

MIT
