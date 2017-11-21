;(function() {
  'use strict'

  //

  //

  var KEY_OUTSIDE_EVENT_LISTENERS = '#O'

  var init = function init(capsid) {
    var on = capsid.on,
      pluginHooks = capsid.pluginHooks

    on.outside = function(event) {
      return function(target, key) {
        var Constructor = target.constructor

        Constructor[KEY_OUTSIDE_EVENT_LISTENERS] = (Constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []).concat(function(el, coelem) {
          var listener = function listener(e) {
            if (el !== e.target && !el.contains(e.target)) {
              coelem[key](e)
            }
          }

          document.addEventListener(event, listener)
        })
      }
    }

    pluginHooks.push(function(el, coelem) {
      ;(coelem.constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []).map(function(eventListenerBinder) {
        eventListenerBinder(el, coelem)
      })
    })
  }

  if (typeof module !== 'undefined' && module.exports) {
    // If the env is common js, then exports init.
    module.exports = init
  } else if (typeof self !== 'undefined' && self.capsid && self.$) {
    // If the env is browser and capsid is already defined
    // Then applies the plugin
    init(self.capsid)
  }
})()
