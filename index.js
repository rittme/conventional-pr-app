const handlePullRequestChange = require('./lib/handle-pull-request-change')

/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.on(
    [
      'pull_request.opened',
      'pull_request.edited',
      'pull_request.labeled',
      'pull_request.unlabeled',
      'pull_request.synchronize'
    ],
    handlePullRequestChange.bind(null, app)
  )
}
