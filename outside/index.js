if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/capsid-outside-events')
} else {
  module.exports = require('../dist/capsid-outside-events.development')
}
