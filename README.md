# custom-class.js v1.0.1

> The utility to create reusable special html classes

***note*** This library depends on jQuery.


## Custom Class

What's a custom class?

### Background

It's very common in frontend engineering to bind handlers to the specific html classes like the following.

```js
$(function () {

    $('.do-something').on('click', someProcess);

});
```

In this example, `.do-something` class has the special functionality of peforming `someProcess` at click on it. However this `.do-something` functionality is only available on that page and isn't reusable everywhere because you always need to write the above piece of code when you want to use `.do-something` class.

A custom class is the reusable version of the above and you can use them everywhere you want. This library help defining such custom classes.

This idea is inspired by Custom Element of Web Components spec.


## Doc

```js
/**
 * @param {String} name The name
 * @param {Function} definingFunction The defining function
 */
$.registerCustomClass(name, definingFunction);
```

This library expose the function `$.registerCustomClass(name, definingFunction)`.

This registers a "custom class" of the given name using the given defining function.
The given defining function is called only once on an element of the given class name at `$(document).ready` timing.
The defining function takes one arugment which is jquery object of the element and `this` of the scope is the bare HTMLElement. This function is called only once for each custom class element.

If you want to add custom class elements after `$(document).ready` timing, you can initialize them by triggering `init.{class-name}` event on `document`, which automatically initializes all custom elements on the page. The initialization doesn't run twice on a element.

See the [DEMO](http://kt3k.github.io/custom-class/test.html).

## Examples

```html
<script>

$.registerCustomClass('go-to-example-com', function () {

    $(this).click(function () {

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

$.registerCustomClass('my-anchor', function (elem) {

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
