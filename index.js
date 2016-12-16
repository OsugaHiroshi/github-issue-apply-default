/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
var githubhook = require('githubhook');
var github = githubhook({
  port:process.env.PORT || 5000,
  path: process.env.ENTRY_POINT
});

var GitHubAPI = require('github');
var githubClient = new GitHubAPI({ });

githubClient.authenticate({
  type: 'token',
  token: process.env.GITHUB_PERSONAL_TOKEN
});

github.listen();

github.on('issues', function (event, repo, ref, data) {
  var action = ref.action;
  var issue = ref.issue;
  var repository = ref.repository;

  console.log('> check action');
  console.log(action);
  if ( action != 'opened' ) {
    return;
  }

  console.log(issue.body);
  var metaInfo = parseMetaInfo(issue.body);

  var request = {
    repo: repository.name,
    owner: repository.owner.login,
    number: issue.number,
    assignee: metaInfo.assignee,
    labels: [metaInfo.labels],
    milestone: metaInfo.milestone
  };

  githubClient.issues.edit( request, function(err, res) {
    console.log(err);
    console.log(res);
  });
});

function parseMetaInfo(issueBody) {
  var KEYS_WHITE_LIST = [
    'assignee',
    'labels',
    'milestone'
  ];
  var TARGET_LINE_REGEX = '^%% (.+)=(.+)';
  var lines = issueBody.split(/\r|\n/);
  var result = lines.reduce(function(result, line) {
    var matches = line.match( TARGET_LINE_REGEX );
    if (!matches) {
      return result;
    }

    var key = matches[1];
    var val = matches[2];

    if (KEYS_WHITE_LIST.indexOf(key) < 0) {
      return result;
    }

    result[key] = val;
    return result;
  }, {});

  return result;
}
