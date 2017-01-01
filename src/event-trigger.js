/**
 */
export default (el: HTMLElement, type: string, detail?: any) => {
  el.dispatchEvent(new CustomEvent(type, { detail }))
}
