module.exports = setStatus;

const getAppConfig = require('../app-config');

function setStatus(newStatus, context) {
  const pullRequest = context.payload.pull_request;
  const { name } = getAppConfig();

  const title = newStatus.valid
    ? 'Valid conventional PR title'
    : 'PR title does not follow conventional commit standards';

  const summary = `found ${newStatus.errorsCount} problems, ${
    newStatus.warnsCount
  } warnings`;

  const text = format(newStatus.errors, newStatus.warnings);

  const checkOptions = {
    name,
    head_branch: '', // workaround for https://github.com/octokit/rest.js/issues/874
    head_sha: pullRequest.head.sha,
    status: 'completed',
    conclusion: newStatus.valid ? 'success' : 'failure',
    completed_at: new Date(),
    output: {
      title,
      summary,
      text
    }
  };

  return context.github.checks.create(context.repo(checkOptions));
}

function format(errors, warnings) {
  let message = '';

  message += errors.map(e => `  - ✖ ${e.message}\n`).join('');
  message += warnings.map(w => `  - ⚠ ${w.message}\n`).join('');

  return message;
}
