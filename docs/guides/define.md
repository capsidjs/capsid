# Define components

You can define components by using [def](../api/core.md#def) method.

```html
<script src="path/to/capsid.js"></script>
<script>
class Hello {
  __init__ () {
    this.el.textContent = 'Hello, world!"
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

The above results

```html
<span class="hello hello-initialized">Hello, world!</span>
```

In the above, `<span class="hello"></span>` automatically becomes 'hello' component and Hello's `__init__` method is automatically called. In Hello class, `this` has `el` property and it points to the mounted dom element, in this case, `<span>` element.

So you can iteract with el (= `<span>`), and in this case, `this.el.textContent = 'Hello, world!'` which inserts the text in `<span>`, and therefore the above result comes.

That's the very basic idea of Capsid!
