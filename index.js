const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Input username: ', (username)=>{
    const url = `https://api.github.com/users/${username}/events/public`;

    fetch(url)
    .then(res => {
        if(!res.ok) throw new Error (`Error: ${res.status} `);
        return res.json();
    })
    .then(data=>{
        if(!Array.isArray(data)){
            console.log('Infor not found');
            rl.close();
            return;
        }
        console.log(`\n Activity of ${username}`);
        data.slice(0, 10).forEach(event=>{

            const {type, repo, payload} = event;
            const repoName = repo.name;
            let message = "";

            switch(type){
                case "PushEvent":
                    const commitCount = payload.commits.length;
                    message = `Pushed ${commitCount} commit${commitCount > 1 ? "s" : " "} to ${repoName}`;
                    break;
                case "IssuesEvent":
                    const action = payload.action;
                    message = `${action === "opened" ? "Opened" : action.charAt(0).toUpperCase() + action.slice(1)} an issue in ${repoName}`;
                    break;
                case "WatchEvent":
                    message = `Started ${repoName}`;
                    break;
                default:
                    message = `${type} in ${repoName}`;
            }
            console.log(`-${message}`);
        })
        rl.close();
    })
    .catch(err=>{
        console.log('error: ', err.message);
        rl.close()
    });
})

