/**
 * Coelement is the dual of element (usual dom). Its instance accompanies an element and forms a Dom Component together with it.
 */
class Coelement {
  /**
   * @param {jQuery} elem The jquery element
   */
  constructor(elem) {
    this.elem = elem
  }
}

module.exports = Coelement
