import { documentElement } from './document'
export default (documentElement as any).matches ||
  (documentElement as any).webkitMatchesSelector ||
  (documentElement as any).msMatchesSelector
