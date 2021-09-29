const tracer = require('..')

tracer.init({
  experimental: {
    exporter: 'ci'
  }
})

/**
 * // The first use for this file would be to read git and CI metadata
 * const { getTestEnvironmentMetadata } = require('../packages/dd-trace/src/plugins/util/test')
 *
 * // Since we expose the request, we can do this:
 * const testEnvironmentMetadata = getTestEnvironmentMetadata('jest')
 *
 * const exporter = tracer._tracer._exporter.request(testEnvironmentMetadata)
 */

module.exports = tracer
