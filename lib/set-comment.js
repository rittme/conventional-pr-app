module.exports = setComment

const format = require('./format')
const getAppConfig = require('../app-config')

async function setComment (newStatus, context) {
  const pr = context.issue()
  const issues = context.github.issues
  const comment = await checkComments(issues, pr)

  // Write a comment with the details (if any)
  if (newStatus.errorCount > 0 || newStatus.warnsCount > 0) {
    const message = format(newStatus.errors, newStatus.warnings)

    if (comment) {
      // edits previous bot comment if found
      await issues.editComment({ ...pr, id: comment.id, body: message })
    } else {
      // if no previous comment create a new one
      await issues.createComment({ ...pr, body: message })
    }
  } else {
    if (comment) {
      // edits previous bot comment if found
      await issues.deleteComment({ ...pr, comment_id: comment.id })
    }
  }
}

/**
 * Checks for a previous bot comment, if found returns the comment
 */
async function checkComments (issues, pr) {
  const { name } = getAppConfig()
  const comments = await issues.getComments(pr)
  return comments.data.some(comment => comment.user.login === name)
}
