'use strict'

const https = require('https')
const log = require('../../log')

const NUM_RETRIES = 5

function retriableRequest (options, callback, client, data) {
  const req = client.request(options, res => {
    let data = ''

    res.setTimeout(options.timeout)

    res.on('data', chunk => { data += chunk })
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        callback(null, data, res.statusCode)
      } else {
        const error = new Error(`Error from the http intake: ${res.statusCode} ${https.STATUS_CODES[res.statusCode]}`)
        error.status = res.statusCode

        callback(error, null, res.statusCode)
      }
    })
  })
  req.setTimeout(options.timeout, req.abort)
  data.forEach(buffer => req.write(buffer))
  return req
}

function request (options, callback) {
  options = Object.assign({
    headers: {},
    data: [],
    timeout: 2000
  }, options)

  const data = [].concat(options.data)

  const request = retriableRequest(options, callback, https, data)

  const errorHandler = (error, attemptIndex) => {
    const retriedReq = retriableRequest(options, callback, https, data)
    if (attemptIndex === NUM_RETRIES) {
      retriedReq.on('error', e => callback(new Error(`Network error trying to reach the agent: ${e.message}`)))
    } else {
      log.debug(`Retrying request due to connection error: ${error}`)
      retriedReq.on('error', error => errorHandler(error, attemptIndex + 1))
    }
  }

  request.on('error', errorHandler)
  request.end()

  return request
}

module.exports = request
