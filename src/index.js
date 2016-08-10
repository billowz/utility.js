import timeoutframe from './timeoutframe'
import Configuration from './Configuration'
import Logger from './log'
import * as _ from './util'
import './polyfill'

export default _.assignIf({
  timeoutframe: timeoutframe,
  Configuration: Configuration,
  Logger: Logger
}, _)
