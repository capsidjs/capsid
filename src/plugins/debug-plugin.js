// @flow

import { COMPONENT_NAME_KEY } from '../util/const'

const install = () => {
  global.capsidDebugMessage = (message: Object) => {
    switch (message.type) {
      case 'event':
        onEventMessage(message)
        break
      default:
        console.log(`Unknown message: ${JSON.stringify(message)}`)
    }
  }
}

/**
 * Gets the bold colored style.
 */
const boldColor = (color: string): string =>
  `color: ${color}; font-weight: bold;`

/**
 * Gets the displayable component name.
 */
const getComponentName = (coelem: any): string => {
  const { constructor } = coelem
  return `${constructor[COMPONENT_NAME_KEY] || constructor.name}`
}

const onEventMessage = ({
  coelem,
  e,
  module,
  color
}: {
  coelem: any,
  e: Event,
  module: string,
  color: string
}) => {
  const event = e.type
  const component = getComponentName(coelem)
  color = color || '#f012be'

  console.groupCollapsed(
    `${module}> %c${event}%c on %c${component}`,
    boldColor(color),
    '',
    boldColor('#1a80cc')
  )
  console.log(e)

  if (e.target) {
    console.log(e.target)
  }

  if (coelem.el) {
    console.log(coelem.el)
  }

  console.groupEnd()
}

export default { install }
