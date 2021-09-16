'use strict'

const AgentExporter = require('./exporters/agent')
const LogExporter = require('./exporters/log')
const AgentlessReporter = require('./exporters/agentless')
const exporters = require('../../../ext/exporters')
const fs = require('fs')
const constants = require('./constants')

module.exports = name => {
  const inAWSLambda = process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined
  const usingLambdaExtension = inAWSLambda && fs.existsSync(constants.DATADOG_LAMBDA_EXTENSION_PATH)
  switch (name) {
    case exporters.LOG:
      return LogExporter
    case exporters.AGENT:
      return AgentExporter
    case exporters.AGENTLESS:
      return AgentlessReporter
    default:
      return inAWSLambda && !usingLambdaExtension ? LogExporter : AgentExporter
  }
}
