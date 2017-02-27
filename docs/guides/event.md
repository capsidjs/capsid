# Event handling

In Capsid, you can declare component's event handling using [@on](../api/decorators.md#on)

```js
class TodoList {

  @on('todo-added') onTodoAdded (e) {
    const todo = e.detail.todo
    // ...
  }

  @on('todo-deleted') onTodoDeleted (e) {
    const todo = e.detail.todo
    // ...
  }

  @on('todo-completed') onTodoCompleted (e) {
    const todo = e.detail.todo
    // ...
  }

  @on('todo-uncompleted') onTodoCompleted (e) {
    const todo = e.detail.todo
    // ...
  }

}
```

```html
<ul class="todo-list">
</ul>
```

In the above, you declare 4 event handlers which react against `todo-added`, `todo-deleted`, `todo-completed` and `todo-uncompleted`.

TBD
