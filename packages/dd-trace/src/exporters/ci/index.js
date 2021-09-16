'use strict'

const URL = require('url').URL
const Writer = require('./writer')
const Scheduler = require('./scheduler')

class CIExporter {
  constructor (config) {
    const { url, hostname, port, flushInterval } = config
    this._url = url || new URL(`http://${hostname || 'localhost'}:${port}`)
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
}

module.exports = CIExporter
