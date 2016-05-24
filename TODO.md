# TODO
- Include cc-event in class-component (keep separate repository)
- Find a good example for $.cc.assign usage.
  - It must be a class component with the internal state.
  - It must be enough simple
  - It must be practical in the frontend dev context.
    - Timer is not really a practical example, though react has it as the second example in its homepage.

## v7

- fn.cc.up() ---> fn.cc()
- fn.cc.up('class names') ---> fn.cc('class names')
- fn.cc.init('classname') ---> fn.cc.init('classname')
- @trigger('classname.started', 'classname.ended') method() {...}
- $.cc('classname', Component)
- @$.cc('classname') class Component {...}
- Component.prototype.get
- Component.prototype.trigger
- Component.prototype.on
- Component.prototype.off
- include dom-gen as a part
- inject this.elem from outside of the constructor
- Include cc-event in class-component (unify the repository)
- switch to 2 space indent

# DONE
- remove sublcass dependency
- switch to es6
- up method should take an argument
- switch to semicolonless style
- Better error message when elem.cc.init with undefined class-component name
  - now it just show empty string
- Rewrite README
- Write getting started
- coverage exclude
- coverage 100%
- coveralls
- make coverage report
- write doc of assign
- write doc of cc
  - init, get, getActor
- update README.md
- make special property $.fn.co
  - like Object.defineProperty($.fn, 'co', blah);
  - bring ClassComponentContext to the repo
- use karma-browserify
- bring assign into this repo
- rename to coelement
- pass test of actor-system with cc v5
- make namespace $.cc
- separate files
- subclass dependency
- Merge class-component-initializer
- remove promise init
