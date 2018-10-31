const { Application } = require('probot');
// Requiring our app implementation
const myProbotApp = require('..');

const pullOpenedPayload = require('./fixtures/pull.opened.json');

describe('My Probot app', () => {
  let app, github;

  beforeEach(() => {
    app = new Application();
    // Initialize the app based on the code from index.js
    app.load(myProbotApp);
    // This is an easy way to mock out the GitHub API
    github = {
      checks: {
        create: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    };
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github);
  });

  test('creates a comment when an issue is opened', async () => {
    // Simulates delivery of an issues.opened webhook
    await app.receive({
      name: 'pull_request.opened',
      payload: pullOpenedPayload.payload
    });

    // This test passes if the code in your index.js file calls `context.github.issues.createComment`
    expect(github.checks.create).toHaveBeenCalled();
  });
});
