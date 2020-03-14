import is from './is'

export default (...args: string[]) => (Cls: Function) => {
  is(...args.map(event => 'sub:' + event))(Cls)
}
