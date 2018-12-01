import def from '../def'
import check from '../util/check'

/**
 * The decorator for class component registration.
 *
 * if `name` is function, then use it as class itself and the component name is kebab-cased version of its name.
 * @param name The class name or the implementation class itself
 * @return The decorator if the class name is given, undefined if the implementation class is given
 */
const component = (name: string): ((desc: any) => void) => {
  check(
    typeof name === 'string' && !!name,
    'Component name must be a non-empty string'
  )

  return (desc: any) => {
    desc.finisher = (Cls: Function) => {
      def(name, Cls)
    }
  }
}

export default component
