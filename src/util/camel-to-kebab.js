// @flow
/**
 * Transform camelCase string to kebab-case string
 * @param camelString The string in camelCase
 * @return The string in kebab-case
 */
export default (camelString: string): string => camelString.replace(/(?!^)[A-Z]/g, '-$&').toLowerCase()
