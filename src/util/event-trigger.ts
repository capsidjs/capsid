/**
 * Triggers the event to the given elements.
 * @param el The element
 * @param type The event type
 * @param detail The optional detail object
 */
export const triggerToElements = (
  elements: HTMLElement[],
  type: string,
  bubbles: boolean,
  result: any
) => {
  const emit = (r: any) => {
    elements.forEach(el => {
      el.dispatchEvent(new CustomEvent(type, { detail: r, bubbles }))
    })
  }
  if (result && result.then) {
    result.then(emit)
  } else {
    emit(result)
  }
}
