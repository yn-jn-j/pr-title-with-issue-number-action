const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const token = core.getInput('repo-token')
        const pullRequestTitle = core.getInput('pr-title')
        const pullRequestNumber = github.context.payload.pull_request.number

        console.log(`PR title : ${pullRequestTitle}`)
        console.log(`PR number : ${pullRequestNumber}`)
        
        if (!pullRequestTitle.toString().includes('[')) {
            let updatedTitle = `[#${pullRequestNumber}] ` + pullRequestTitle;
            
            console.log(`Updated title : ${updatedTitle}`)
            
            const octokit = github.getOctokit(token);
            const response = await octokit.rest.pulls.update({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
            });
            
            core.info(`Response : ${response.status}`);
            if(response.status !== 200) {
                core.error('Updating failed');
            }
        }
        else {
            console.log('Update Not Necessary!')
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
