# Getting started

## Defining a component

In `capsid`, the first thing you need to do is defining a component. You can define a component in capsid by JavaScript class and `def` function.

```js
class Hello {
  __mount__ () {
    this.el.textContent = 'hello'
  }
}

capsid.def('hello', Hello)
```

Here, you defined `hello` component. Then how to use `hello` component?

## Using a component

To use a component, you can put HTML elements which has the class attribute which has the same name to the component.

For example, if you want to use `hello` component, then you writes `<span class="hello"></span>` in html and this `span` tag works as `hello` component.

## What is `__mount__` in `hello` example?

Look at the first example again.

```js
class Hello {
  __mount__ () {
    this.el.textContext = 'hello'
  }
}

capsid.def('hello', Hello)
```

What is `__mount__`? `__mount__` is the function which is invoked once per each element when it is initialized as component. In the above example, `this.el.textContext = 'hello'` is called each time when the component initialized.

## What is `this.el` in `hello` example?

Well, `this.el` is the element (i.e. HTML DOM node) which the component has mounted.

For example, you defined `hello` component and placed `<span class="hello"></span>` in a page. Then `hello` component mounts to that `span` tag and `this.el` is `span` tag itself in this case.

So the meaning of `this.el.textContent = 'hello'` is that it assigns `hello` string to the textContent of `span` element. The result is something like:

```html
<span class="hello">hello</span>
```

That's the point of `hello` example!

[See the working example](https://codepen.io/kt3k/pen/MmYxBB?editors=1010)
