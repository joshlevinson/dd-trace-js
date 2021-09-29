'use strict'

class Writer {
  constructor () {
    this._trace = []
  }

  append (spans) {
    this._trace = this._trace.concat(spans)
  }

  _sendPayload (data, done) {
    done()
  }

  flush (done = () => {}) {
    const count = this._trace.length

    const payload = JSON.stringify(this._trace)
    this._trace = []

    if (count > 0) {
      this._sendPayload(payload, done)
    } else {
      done()
    }
  }
}

module.exports = Writer
