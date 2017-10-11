// @flow

import { COMPONENT_NAME_KEY } from '../util/const'

export default (message: Object) => {
  switch (message.type) {
    case 'event':
      onEventMessage(message)
      break
    case 'outside-event':
      onOutsideEventMessage(message)
      break
    default:
      console.log(`Unknown message: ${JSON.stringify(message)}`)
  }
}

/**
 * Gets the bold colored style.
 * @return {string}
 */
const boldColor = color => `color: ${color}; font-weight: bold;`

/**
 * Gets the displayable component name.
 */
const getComponentName = coelem => {
  const { constructor } = coelem
  return `${constructor[COMPONENT_NAME_KEY] || constructor.name}`
}

const onEventMessage = ({ el, coelem, e }: { el: HTMLElement, coelem: any, e: Event }) => {
  const event = e.type
  const component = getComponentName(coelem)

  console.groupCollapsed(
    `%c${event} %con %c${component}`,
    boldColor('#f012be'),
    '',
    boldColor('#2ecc40')
  )
  console.log(e)
  console.groupEnd()
}

const onOutsideEventMessage = ({ el, coelem, e }: { el: HTMLElement, coelem: any, e: Event }) => {
  const event = e.type
  const component = getComponentName(coelem)

  console.groupCollapsed(
    `%coutside ${event} %con %c${component}`,
    boldColor('#39cccc'),
    '',
    boldColor('#2ecc40')
  )
  console.log(e)
  console.groupEnd()
}
