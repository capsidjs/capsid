const $ = jQuery

/**
 * This is class component contenxt manager class. This help to initialize and get colements.
 * @param {jQuery} jqObj jQuery object of a dom selection
 */
export default function ClassComponentContext (jqObj) {
  this.jqObj = jqObj
}

const prototype = ClassComponentContext.prototype

/**
 * Initializes the element if it has registered class component names. Returns the jquery object itself.
 * @param {string} [classNames] The class name.
 * @return {jQuery}
 */
prototype.up = function (classNames) {
  const __manager__ = $.cc.__manager__
  const jqObj = this.jqObj

  if (classNames) {
    classNames.split(/\s+/).forEach(className => {
      jqObj.addClass(className) // adds the class name

      __manager__.initAt(className, jqObj) // init as the class-component
    })
  } else {
    // Initializes anything it already has.
    __manager__.initAllAtElem(jqObj)
  }

  return jqObj
}

/**
 * Gets the coelement of the given name.
 * @param {String} coelementName The name of the coelement
 * @return {Object}
 */
prototype.get = function (coelementName) {
  const jqObj = this.jqObj
  const coelement = jqObj.data('__coelement:' + coelementName)

  if (coelement) {
    return coelement
  }

  if (jqObj[0]) {
    throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + jqObj[0].tagName)
  }

  throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection')
}
