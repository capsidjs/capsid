import ccc from './ccc'
import prep from './prep'
import initComponent from './init-component'

import check from './util/check'
import { ready } from './util/document'
import { COMPONENT_NAME_KEY, COELEMENT_DATA_KEY_PREFIX } from './util/const'
import { addMountHook } from './add-hidden-item'

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

  ;(Constructor as any)[COMPONENT_NAME_KEY] = name
  const initClass = `${name}-💊`

  addMountHook(Constructor, (el: HTMLElement, coel: any) => {
    ;(el as any)[COELEMENT_DATA_KEY_PREFIX + name] = coel
    el.classList.add(name, initClass)
  })

  /**
   * Initializes the html element by the configuration.
   * @param el The html element
   */
  const initializer = (el: HTMLElement) => {
    if (!el.classList.contains(initClass)) {
      initComponent(Constructor, el)
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
