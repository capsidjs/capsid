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
 */
const boldColor = (color: string): string => `color: ${color}; font-weight: bold;`

/**
 * Gets the displayable component name.
 */
const getComponentName = (coelem: any): string => {
  const { constructor } = coelem
  return `${constructor[COMPONENT_NAME_KEY] || constructor.name}`
}

const onEventMessage = ({ coelem, e }: { coelem: any, e: Event }) => {
  const event = e.type
  const component = getComponentName(coelem)

  console.groupCollapsed(`%c${event} %con %c${component}`, boldColor('#f012be'), '', boldColor('#2ecc40'))
  console.log(e)
  console.groupEnd()
}

const onOutsideEventMessage = ({ coelem, e }: { coelem: any, e: Event }) => {
  const event = e.type
  const component = getComponentName(coelem)

  console.groupCollapsed(`%coutside ${event} %con %c${component}`, boldColor('#39cccc'), '', boldColor('#2ecc40'))
  console.log(e)
  console.groupEnd()
}
