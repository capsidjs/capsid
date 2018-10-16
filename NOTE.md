# Note

## 1 to 1 relationship

1 to 1 relationship between DOM element and component. Backbone allow a component to more than 1 element. Capsid always requires component to mount to single DOM element.

## Communication to the parent

If you need to pass data to the parent in capsid, use `@emits` decorator to buble the event from children, and use `@on` decorator to catch them in parents.

```js
class MyComponent {
  @emits('custom-event')
  requestSomethingToParent() {
    // ... some processing
    return data // to pass to the parent.
  }
}
```

```js
class MyParent {
  @on('custom-event')
  handleRequest(){
    // ... handling
  }
}
```

## Communication to the children
