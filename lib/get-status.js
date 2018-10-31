module.exports = getStatus;

const { lint, load } = require('@commitlint/core');
const config = require('./config');

async function getStatus(context) {
  const title = context.payload.pull_request.title;
  const { rules } = await load(config);
  const { valid, errors, warnings } = await lint(title, rules);
  return {
    valid,
    errors,
    warnings,
    errorsCount: errors.length,
    warnsCount: warnings.length
  };
}
