'use strict'

const URL = require('url').URL
const Writer = require('./writer')
const Scheduler = require('./scheduler')

class CIExporter {
  constructor (config) {
    const { flushInterval } = config
    this._url = new URL('https://trace.browser-intake-datadoghq.com')
    this._writer = new Writer({ url: this._url })

    if (flushInterval > 0) {
      this._scheduler = new Scheduler(() => this._writer.flush(), flushInterval)
    }
    this._scheduler && this._scheduler.start()
  }
  // expose request
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
