require('./polyfill')
const _ = require('./util')

module.exports = _.assignIf(_, {
  timeoutframe: require('./timeoutframe'),
  Configuration: require('./Configuration')
}, require('./log'))
