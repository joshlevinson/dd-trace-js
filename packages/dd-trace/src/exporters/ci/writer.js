'use strict'

const request = require('./request')
const log = require('../../log')

class Writer {
  constructor ({ url }) {
    this._url = url
    this._trace = []
  }

  append (spans) {
    this._trace = this._trace.concat(spans)
  }

  _sendPayload (data, count, done) {
    makeRequest(data, count, this._url, (err, res, status) => {
      if (err) {
        log.error(err)
        done()
        return
      }
      log.debug(`Response from the http intake: ${res}`)
      done()
    })
  }

  flush (done = () => {}) {
    const count = this._trace.length

    if (count > 0) {
      this._sendPayload(this._trace, count, done)
    } else {
      done()
    }
  }
}

function makeRequest (data, count, url, cb) {
  const byteLength = data.reduce((acc, trace) => {
    return acc + Buffer.byteLength(JSON.stringify(trace))
  }, 0)
  const options = {
    path: `/api/v2/spans`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': byteLength,
      'DD-API-KEY': process.env.DATADOG_API_KEY
    }
  }

  options.protocol = url.protocol
  options.hostname = url.hostname
  options.port = url.port

  request(Object.assign({ data }, options), (err, res, status) => {
    cb(err, res, status)
  })
}

module.exports = Writer
