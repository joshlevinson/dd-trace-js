'use strict'

const request = require('./request')
const log = require('../../log')
const uuid = require('crypto-randomuuid')

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

    const payload = JSON.stringify({
      spans: this._trace,
      env: 'testing-juan'
    })
    this._trace = []

    if (count > 0) {
      this._sendPayload(payload, count, done)
    } else {
      done()
    }
  }
}

function makeRequest (data, count, url, cb) {
  const options = {
    path: `/api/v2/spans`,
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Content-Length': Buffer.byteLength(data),
      'DD-API-KEY': process.env.DATADOG_API_KEY,
      'DD-EVP-ORIGIN': 'nodejs-tracer',
      'DD-REQUEST-ID': uuid()
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
