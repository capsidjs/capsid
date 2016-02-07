# TODO
- Better error message when elem.cc.init with undefined class-component name
  - now it just show empty string

- Find a good example for $.cc.assign usage.
  - It must be a class component with the internal state.
  - It must be enough simple
  - It must be practical in the frontend dev context.
    - Timer is not really a practical example, though react has it as the second example in its homepage.


# DONE
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
