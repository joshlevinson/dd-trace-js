const { getTestEnvironmentMetadata } = require('./packages/dd-trace/src/plugins/util/test')

const tracer = require('.')

debugger

tracer.init({
  experimental: {
    exporter: 'agentless'
  }
})
// get git metadata
const testEnvironmentMetadata = getTestEnvironmentMetadata('jest')

module.exports = tracer
