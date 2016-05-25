'use strict'

const $ = global.jQuery

const ClassComponentConfiguration = require('./class-component-configuration')

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 */
class ClassComponentManager {

  constructor() {

    /**
     * @property {Object<ClassComponentConfiguration>} ccc
     */
    this.ccc = {}

  }

  /**
   * Registers the class component configuration for the given name.
   *
   * @param {String} name The name
   * @param {Function} Constructor The constructor of the class component
   */
  register(name, Constructor) {

    Constructor.coelementName = name

    this.ccc[name] = new ClassComponentConfiguration(name, Constructor)

  }

  /**
   * Initializes the class components of the given name in the given element.
   *
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
   * @return {Array<HTMLElement>} The elements which are initialized in this initialization
   * @throw {Error}
   */
  init(className, elem) {

    const ccc = this.getConfiguration(className)

    return $(ccc.selector(), elem).each(function () {

      ccc.initElem($(this))

    }).toArray()

  }

  /**
   * Initializes the class component of the give name at the given element.
   *
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The element
   */
  initAt(className, elem) {

    const ccc = this.getConfiguration(className)

    ccc.initElem($(elem))

  }

  /**
   * Initializes all the class component at the element.
   *
   * @param {HTMLElement}
   */
  initAllAtElem(elem) {

    const classes = $(elem).attr('class')

    if (!classes) {
      return
    }

    classes.split(/\s+/)
      .map(className => this.ccc[className])
      .filter(ccc => ccc)
      .forEach(ccc => ccc.initElem(elem))

  }

  /**
   * @param {jQuery|HTMLElement|String} elem The element
   */
  initAll(elem) {

    Object.keys(this.ccc).forEach(className => {

      this.init(className, elem)

    })

  }

  /**
   * Gets the configuration of the given class name.
   *
   * @param {String} className The class name
   * @return {ClassComponentConfiguration}
   * @throw {Error}
   */
  getConfiguration(className) {

    const ccc = this.ccc[className]

    if (ccc == null) {

      throw new Error('Class componet "' + className + '" is not defined.')

    }

    return ccc

  }

}

module.exports = ClassComponentManager
