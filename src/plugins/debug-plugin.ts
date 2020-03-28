import { COMPONENT_NAME_KEY } from '../util/const'

const install = () => {
  ;(global as any).capsidDebugMessage = (message: any) => {
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
const getComponentName = (coel: any): string => {
  const { constructor } = coel
  return `${constructor[COMPONENT_NAME_KEY] || constructor.name}`
}

const defaultEventColor = '#f012be'

const onEventMessage = ({
  coel,
  e,
  module,
  color
}: {
  coel: any
  e: Event
  module: string
  color?: string
}) => {
  const event = e.type
  const component = getComponentName(coel)

  console.groupCollapsed(
    `${module}> %c${event}%c on %c${component}`,
    boldColor(color || defaultEventColor),
    '',
    boldColor('#1a80cc')
  )
  console.log(e)

  if (e.target) {
    console.log(e.target)
  }

  if (coel.el) {
    console.log(coel.el)
  }

  console.groupEnd()
}

export default { install }
