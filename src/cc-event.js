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

/**
 * The decorator to prepend and append event trigger.
 * @param {string} start The event name when the method started
 * @param {string} end The event name when the method finished
 * @param {string} error the event name when the method errored
 */
const trigger = (start, end, error) => (prototype, name) => {
    const method = prototype[name]

    prototype[name] = function () {
        if (start != null) {
            this.elem.trigger(start)
        }

        const result = method.apply(this, arguments)

        const promise = Promise.resolve(result)

        if (end != null) {
            promise.then(() => this.elem.trigger(end))
        }

        if (error != null) {
            promise.catch(() => this.elem.trigger(error))
        }

        return result
    }
}

exports.event = event
exports.trigger = trigger
