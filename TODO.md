# TODO
- doc: create document site
- doc: testing of cc component with reference to Presenter First of atomic object
- doc: describe layered MVP programming with class-component.js with reference to PAC and HMVC

## >= v10
- include dom-gen as a part

# DONE
- @autowired decorator
- chore: remove @event
- chore: remove @trigger
- chore: list supported user projects
## v9
- decorator @trigger('event').first
- decorator @trigger('event').last
- decorator @trigger('event').on.error
- decorator @on(event).at(selector)
## v7
- switch to 2 space indent
- Include cc-event in class-component (keep separate repository)
- @trigger('classname.started', 'classname.ended') method() {...}
- Include cc-event in class-component (unify the repository)
- $.cc('classname', Component)
- fn.cc.up() ---> fn.cc()
- fn.cc.up('class names') ---> fn.cc('class names')
- fn.cc.init('classname') ---> fn.cc.init('classname')
## <= v6
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
