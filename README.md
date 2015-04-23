# custom-class.js v1.0.1

> define a special class with js ability

***note*** This library depends on jQuery.


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
The defining function doesn't take arugments and `this` of the scope is the custom class element itself and you can modify it as you want.

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

$.registerCustomClass('my-anchor', function () {

    var self = $(this); //

    self.on('click', function () {

        location.href = $(this).attr('href');

    });

    self.on('mouseover', function () {

        $(this).addClass('hover');

    });

    self.on('mouseout', function () {

        $(this).removeClass('hover');

    });

});

</script>

<div class="my-anchor" href="https://www.google.com/">...</div>
```

This `.my-anchor` class is similar to `<a>`.

When you click the above div, the page goes to href's url (https://www.google.com/ in this case) and when you mouse over it, it gets `.hover` class.

## License

MIT
