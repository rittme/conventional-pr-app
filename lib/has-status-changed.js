module.exports = hasStatusChanged

const getAppConfig = require('../app-config')

async function hasStatusChanged (newStatus, context) {
  const { name } = getAppConfig()
  const {
    data: { check_runs: checkRuns }
  } = await context.github.checks.listForRef(
    context.repo({
      ref: context.payload.pull_request.head.sha,
      check_name: name
    })
  )

  if (checkRuns.length === 0) return true

  const [{ conclusion, output }] = checkRuns
  const isValid = conclusion !== 'failure'
  const hasOverride = output && /override/.test(output.title)

  return isValid !== newStatus.valid || hasOverride !== newStatus.override
}
