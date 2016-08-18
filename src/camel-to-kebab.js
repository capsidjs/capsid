export default camelString => camelString.replace(/[A-Z]/g, c => '-' + c.toLowerCase()).replace(/^-/, '')
