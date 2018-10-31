const getStatus = require('./get-status')
const setCheck = require('./set-check')
// const hasStatusChanged = require('./has-status-changed');

module.exports = handlePullRequestChange

async function handlePullRequestChange (app, context) {
  try {
    // 1. get new status
    const newStatus = await getStatus(context)

    // 2. if status did not change then don’t create a new check run. Quotas for
    //    mutations are more restrictive so we want to avoid them if possible
    /* const hasChange = await hasStatusChanged(newStatus, context);
    if (!hasChange) {
      return;
    } */

    await setCheck(newStatus, context)
  } catch (error) {
    try {
      // workaround for https://github.com/octokit/rest.js/issues/684
      const parsed = JSON.parse(error.message)
      for (const key in parsed) {
        error[key] = parsed[key]
      }

      context.log.error(error)
    } catch (e) {
      context.log.error(error)
    }
  }
}
