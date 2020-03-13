import ccc from './ccc'
import prep from './prep'
import initComponent from './init-component'

import check from './util/check'
import { ready } from './util/document'

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
const def = (name: string, Constructor: Function) => {
  check(
    typeof name === 'string',
    '`name` of a class component has to be a string.'
  )
  check(
    typeof Constructor === 'function',
    '`Constructor` of a class component has to be a function'
  )

  const initClass = `${name}-💊`

  /**
   * Initializes the html element by the configuration.
   * @param el The html element
   */
  const initializer = (el: HTMLElement) => {
    const classList = el.classList

    if (!classList.contains(initClass)) {
      classList.add(name, initClass)

      initComponent(Constructor, el, name)
    }
  }

  // The selector
  initializer.sel = `.${name}:not(.${initClass})`

  ccc[name] = initializer

  ready.then(() => {
    prep(name)
  })
}

export default def
