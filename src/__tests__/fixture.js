export class Foo {
  __init__ () {
    this.el.setAttribute('is_foo', 'true')
  }
}

export class Bar {
  __init__ () {
    this.el.setAttribute('is_bar', 'true')
  }
}

export class Spam {
  __init__ () {
    this.$el.attr('is_spam', 'true')
    this.$el.toggleClass('spam-toggle-test')
  }
}
