const core = require('@actions/core')
const github = require('@actions/github')

function updatePullRequestTitle(title, number) {
    const response = {
        title: title,
        updated: false
    };

    // "[131] title" to "[#131] title"
    if (/^\[[0-9]+\]/.test(title)) {
        let issueNumber = /^\[[0-9]+\]/.exec(title)[0].slice(1,-1)
        response.title = title.replace(/^\[[0-9]+\]/, `[#${issueNumber}]`);
        response.updated = true
    }

    // "#131 title" to "[#131] title"
    else if (/^\#\d+/.test(title)) {
        let prissue = /^\#\d+/.exec(title)[0]
        response.title =  title.replace(/^\#\d+/, `[${prissue}]`);
        response.updated = true
    }

    // "[] title" to "[#131] title"
    else if (/^\[\s?\]/.test(title)) {
        response.title = title.replace(/^\[\s?\]/,`[#${number}]`)
        response.updated = true
    }

    // "[#] title" to "[#131] title"
    else if (/^\[#\]/.test(title)) {
        response.title = title.replace(/^\[#\]/,`[#${number}]`)
        response.updated = true
    }

    // "title" to "[#131] title"
    else if (!/\#[[0-9]+|^\[[a-zA-Z]+\]/.test(title)) {
        response.title =  `[#${number}] ` + title;
        response.updated = true
    }

    console.log(response)
    return response;
}

async function run() {
    try {
        const token = core.getInput('repo-token')
        const pullRequestTitle = core.getInput('pr-title')
        const pullRequestNumber = github.context.payload.pull_request.number

        console.log(`PR title : ${pullRequestTitle}`)
        console.log(`PR number : ${pullRequestNumber}`)

        const updatedValue = updatePullRequestTitle(pullRequestTitle, pullRequestNumber);

        if (updatedValue.updated) {
            console.log(`Updated title : ${updatedValue.title}`)
            
            const octokit = github.getOctokit(token);
            const request = {
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
                title: updatedValue.title
            }

            const response = await octokit.rest.pulls.update(request);
            
            if(response.status !== 200) {
                core.error('Updating Pull Request Failed');
            }
        }
        else {
            console.log('Update Not Necessary')
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
