const ListenerInfo = require('./listener-info')

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 * @param {string} selector The selector for listening. When null is passed, the listener listens on the root element of the component.
 * @param {object} prototype The prototype of the coelement class
 * @param {string} name The name of the method
 */
const event = (event, selector) => (prototype, name) => {
    const method = prototype[name]

    method.__events__ = method.__events__ || []

    method.__events__.push(new ListenerInfo(event, selector, method))
}

module.exports = event
