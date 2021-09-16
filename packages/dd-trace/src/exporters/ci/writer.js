'use strict'

const request = require('./request')
const log = require('../../log')
const tracerVersion = require('../../../lib/version')

class Writer {
  constructor ({ url }) {
    this._url = url
    this._trace = []
  }

  append (spans) {
    this._trace.append(spans)
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

function setHeader (headers, key, value) {
  if (value) {
    headers[key] = value
  }
}

function makeRequest (data, count, url, cb) {
  const options = {
    path: `/traces`, // dummy path
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Datadog-Meta-Tracer-Version': tracerVersion,
      'X-Datadog-Trace-Count': String(count)
    }
  }

  setHeader(options.headers, 'Datadog-Meta-Lang', 'nodejs')
  setHeader(options.headers, 'Datadog-Meta-Lang-Version', process.version)
  setHeader(options.headers, 'Datadog-Meta-Lang-Interpreter', process.jsEngine || 'v8')

  options.protocol = url.protocol
  options.hostname = url.hostname
  options.port = url.port

  request(Object.assign({ data }, options), (err, res, status) => {
    cb(err, res, status)
  })
}

module.exports = Writer
