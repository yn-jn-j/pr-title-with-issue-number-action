const core = require('@actions/core')
const github = require('@actions/github')


async function run() {
    try {
        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);

    const request = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.payload.pull_request.number,
    }

    const token = core.getInput('repo-token')
    const pullRequestTitle = core.getInput('pr-title')
    const pullRequestNumber = github.context.payload.pull_request.number

    console.log(pullRequestTitle)
    console.log(pullRequestNumber)
} catch (error) {
    core.setFailed(error.message);
}

run()
