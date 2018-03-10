// @flow

export class Foo {
  el: HTMLElement

  __init__ () {
    this.el.setAttribute('is_foo', 'true')
  }
}

export class Bar {
  el: HTMLElement

  __init__ () {
    this.el.setAttribute('is_bar', 'true')
  }
}

export class Spam {
  $el: any

  __init__ () {
    this.$el.attr('is_spam', 'true')
    this.$el.toggleClass('spam-toggle-test')
  }
}
