# Component and Coelement

In capsid, an **element** means an HTMLElement or just a dom node, like `<a>`, `<p>`, `<div>` etc. A **coelement** is a class which you define and register by [def](../api/core.md#def) function.

```html
<script>
class Timer { ... }

capsid.def('timer', Timer)
</script>

<span class="timer"></timer>
```

In the above, Timer is the coelement class and `<span>` is the element which the timer mounts.

In capsid, a **component** means the combination of an element and a coelement. In the above, `<span>` is the element and Timer is the coelement and the combination of those two is the component.




