// @flow
/**
 * Triggers the event.
 * @param el The element
 * @param type The event type
 * @param detail The optional detail object
 */
export default (
  el: HTMLElement,
  type: string,
  bubbles: boolean,
  detail?: any
): void => {
  el.dispatchEvent(new CustomEvent(type, { detail, bubbles }))
}
