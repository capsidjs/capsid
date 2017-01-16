'use strict';

(function () {
  'use strict';

  //      


  /**
   * The mapping from class-component name to its initializer function.
   */

  //      
  /**
   * Asserts the given condition holds, otherwise throws.
   * @param assertion The assertion expression
   * @param message The assertion message
   */

  function check(assertion, message) {
    if (!assertion) {
      throw new Error(message);
    }
  }

  /**
   * @param classNames The class names
   */
  function checkClassNamesAreStringOrNull(classNames) {
    check(typeof classNames === 'string' || classNames == null, 'classNames must be a string or undefined/null.');
  }

  /**
   * Asserts the given name is a valid component name.
   * @param name The component name
   */

  //      

  /**
   * Applies the jquery plugin to cc and $
   * @param cc The class-component function
   * @param $ The jQuery function
   */
  var init = function init(cc, $) {
    $.cc = cc;
    var ccc = cc.__ccc__;
    var _get = cc.get;

    var descriptor = { get: function get() {
        var $el = this;
        var dom = $el[0];

        check(dom != null, 'cc (class-component context) is unavailable at empty dom selection');

        var cc = dom.cc;

        if (!cc) {
          /**
           * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
           * @param {?string} classNames The class component names
           * @return {jQuery}
           */
          cc = dom.cc = function (classNames) {
            checkClassNamesAreStringOrNull(classNames);(classNames || dom.className).split(/\s+/).map(function (className) {
              if (ccc[className]) {
                ccc[className]($el.addClass(className)[0]);
              }
            });

            return $el;
          };

          /**
           * Gets the coelement of the given name.
           * @param {string} name The name of the coelement
           * @return {Object}
           */
          cc.get = function (name) {
            return _get(name, dom);
          };

          cc.init = function (className) {
            return cc(className).cc.get(className);
          };
        }

        return cc;
      } };

    // Defines the special property cc on the jquery prototype.
    Object.defineProperty($.fn, 'cc', descriptor);

    // Applies jQuery initializer plugin
    cc.plugins.push(function (el, coel) {
      coel.$el = $(el);
      coel.elem = coel.$el; // backward compat, will be removed
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    // If the env is common js, then exports init.
    module.exports = init;
  } else if (typeof self !== 'undefined' && self.cc && self.$ && !self.$.cc) {
    // If the env is browser and cc and $ is already defined and this plugin isn't applied yet
    // Then applies the plugin here.
    init(self.cc, self.$);
  }
})();

