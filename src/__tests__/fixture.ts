export class Foo {
  el: HTMLElement

  __mount__ () {
    this.el.setAttribute('is_foo', 'true')
  }
}

export class Bar {
  el: HTMLElement

  __mount__ () {
    this.el.setAttribute('is_bar', 'true')
  }
}

export class Spam {
  $el: any

  __mount__ () {
    this.$el.attr('is_spam', 'true')
    this.$el.toggleClass('spam-toggle-test')
  }
}
