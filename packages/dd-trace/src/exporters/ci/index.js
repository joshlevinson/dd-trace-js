'use strict'

const Writer = require('./writer')
const Scheduler = require('./scheduler')

class CIExporter {
  constructor (config) {
    const { flushInterval } = config
    this._writer = new Writer()

    if (flushInterval > 0) {
      this._scheduler = new Scheduler(() => this._writer.flush(), flushInterval)
    }
    this._scheduler && this._scheduler.start()
  }
  // Request is exposed
  request () {
    return this._writer._sendPayload
  }

  export (spans) {
    this._writer.append(spans)

    if (!this._scheduler) {
      this._writer.flush()
    }
  }
}

module.exports = CIExporter
