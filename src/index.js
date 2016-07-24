import * as tf from './timeoutframe'
import Configuration from './Configuration'
import * as log from './log'
import * as _ from './util'
import './polyfill'

export default _.assignIf(_, {
  timeoutframe: tf,
  Configuration: Configuration
}, log)
