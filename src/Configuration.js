import * as _ from './util'

export default _.dynamicClass({
  constructor(def) {
    this.cfg = def || {}
    this.listens = []
  },
  register(name, defVal) {
    if (arguments.length == 1) {
      _.each(name, (val, name) => {
        this.cfg[name] = val
      })
    } else {
      this.cfg[name] = defVal
    }
    return this
  },
  config(cfg) {
    if (cfg) _.each(this.cfg, (val, key) => {
      if (_.hasOwnProp(cfg, key)) {
        var oldVal = this.cfg[key],
          val = cfg[key]

        this.cfg[key] = val
        _.each(this.listens, h => h(key, val, oldVal, this))
      }
    })
    return this
  },
  get(name) {
    return arguments.length ? this.cfg[name] : _.create(this.cfg)
  },
  listen(handler) {
    this.listens.push(handler)
  },
  unlisten(handler) {
    let idx = _.lastIndexOf(this.listens, handler)
    if (idx != -1)
      this.listens.splice(idx, 1)
  }
})
