// @flow
import on from './on.js'

/**
 * @param {string} at The selector
 */
export default (at: string) => on('click', { at })
