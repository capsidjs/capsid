export class Foo {
  el?: HTMLElement;

  __mount__() {
    this.el!.setAttribute("is_foo", "true");
  }
}

export class Bar {
  el?: HTMLElement;

  __mount__() {
    this.el!.setAttribute("is_bar", "true");
  }
}
