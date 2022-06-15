const core = require('@actions/core')
const github = require('@actions/github')

try {
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);

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

    if (!pullRequestTitle.toString().includes('[')) {
        let updatedTitle = `[${pullRequestNumber}] ` + pullRequestTitle;
        core.setOutput('titleUpdated', updatedTitle)

        console.log(updatedTitle)

        request.title = updatedTitle;

        const octokit = github.getOctokit(token);
        const response = await octokit.pulls.update(request);

        if (response.status !== 200) {
            core.error("failed");
        }
        console.log("Title Updated !")
    }
} catch (error) {
    core.setFailed(error.message);
}
