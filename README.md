# custom-class.js v1.0.0

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
You can define the behaviour of the custom class by the defining function. `this` of the defining function scope is the custome class element itself.

This automatically initializes all custom class elements on the page at `$(document).ready` timing.

This also registers `init.class-name` event handler to `document`, which invokes the initialization of the class,
so if you want to initialize them after `$(document).ready`, you need to trigger `init.class-name` event on the document.

The initialization doesn't run over twice for a element.

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
