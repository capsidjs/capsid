const $ = global.jQuery

/**
 * This is class component contenxt manager class. This help to initialize and get colements.
 * @param {jQuery} jqObj jQuery object of a dom selection
 */
module.exports = function (jqObj) {
  this.jqObj = jqObj
}

const prototype = module.exports.prototype

/**
 * Inserts the class name, initializes as the class component and returns the coelement if exists.
 * @param {String} className The class name
 * @return {Object}
 */
prototype.init = function (className) {
  this.up(className)

  return this.get(className)
}

/**
 * Initializes the element if it has registered class component names. Returns the jquery object itself.
 * @param {string} [classNames] The class name.
 * @return {jQuery}
 */
prototype.up = function (classNames) {
  if (classNames != null) {
    classNames.split(/\s+/).forEach(className => {
      this.jqObj.addClass(className) // adds the class name

      $.cc.__manager__.initAt(className, this.jqObj) // init as the class-component
    })
  } else {
    // Initializes anything it already has.
    $.cc.__manager__.initAllAtElem(this.jqObj)
  }

  return this.jqObj
}

/**
 * Gets the coelement of the given name.
 * @param {String} coelementName The name of the coelement
 * @return {Object}
 */
prototype.get = function (coelementName) {
  const coelement = this.jqObj.data('__coelement:' + coelementName)

  if (coelement) {
    return coelement
  }

  if (this.jqObj.length === 0) {
    throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection')
  }

  throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName)
}
