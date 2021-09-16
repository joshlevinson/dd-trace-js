const { getTestEnvironmentMetadata } = require('./packages/dd-trace/src/plugins/util/test')

const tracer = require('.')

tracer.init({
  experimental: {
    exporter: 'ci'
  }
})

const exporter = tracer._tracer._exporter

// get git metadata
const testEnvironmentMetadata = getTestEnvironmentMetadata('jest')

// send first request with test environment metadata
exporter.request(testEnvironmentMetadata)

module.exports = tracer
