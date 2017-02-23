# Component and Coelement

In capsid, an **element** means an HTMLElement or just a dom node, like `<a>`, `<p>`, `<div>` etc. A **coelement** is a JavaScript class which you define and register by [def](../api/core.md#def) function.

```html
<script>
class Timer { ... }

capsid.def('timer', Timer)
</script>

<span class="timer"></timer>
```

In the above, Timer is the coelement class and `<span>` is the element which the timer mounts.

In capsid, a **component** means the combination of an element and a coelement. In the above, `<span>` is the element, Timer is the coelement and the combination of those two is the component.

<img width="300" src="../images/coelement-component-basic.svg" />

In `timer` example:

<img width="300" src="../images/coelement-component-example.svg" />

## Why 'coelement'?

```
coelement = co + element
```

In this case, 'co' means something complimentary to the main thing. And in this case 'coelement' means something which is complimentary to `element`. So you should implement in coelement what you think is missing in the normal dom elemenet.
