const axios = require('axios')
const localforage = require('localforage')

const { setupCache } = require('axios-cache-adapter')

const GITHUB_BASE_URL = 'https://api.github.com'

const cache = setupCache({
    maxAge: 1440 * 60 * 1000, // 24 hours
    store: localforage.createInstance({
        name: "datadog-repos"
      })
})
const api = axios.create({
    adapter: cache.adapter
})

const getRepos = (page:number) => {
    let repos: any[] = []
    return new Promise(async (resolve:any, reject:any) => {
        try {
            localforage.getItem(`${GITHUB_BASE_URL}/orgs/DataDog/repos`, async (err:string, value:JSON) => {
                if (err || value == null) {
                    let res = await api.get(`${GITHUB_BASE_URL}/orgs/DataDog/repos`, { 
                        params: {
                            type: 'public',
                            per_page: 100,
                            page: page
                        }
                    })
                    repos = repos.concat(res.data)
        
                    if (res.data.length > 99) repos = repos.concat(await getRepos(page + 1))
        
                    resolve(repos)
                }
                resolve(value)
              });
        } catch(error:any) {
            // reject(error)
        }
    })
}

const getReleses = async (repo:any) => {
    return new Promise(async (resolve:any, reject:any) => {
        try {
            localforage.getItem(`${GITHUB_BASE_URL}/repos/DataDog/${repo.name}/releases/latest`, async (err:string, value:JSON) => {
                if (err || value == null) {
                    let releases = await api.get(`${GITHUB_BASE_URL}/repos/DataDog/${repo.name}/releases/latest`)

                    resolve(releases.data)
                }
                resolve(value)
            });
        } catch(error:any) {
            // reject(error)
        }
    })
}

const filterRepos = (repos:any) => {
    return new Promise(async (resolve:any, reject:any) => {
        try {
            const filteredResult = {
                agent: [] as JSON[],
                configManager: [] as JSON[],
                tracer: [] as JSON[],
                aws: [] as JSON[],
                kube: [] as JSON[],
                rum: [] as JSON[],
                api: [] as JSON[]
            }
    
            await Promise.all(repos.map(async (r:any) => {
                try {
                    if (r.name.match(/^dd-agent$/gm) || r.name.match(/^datadog-agent$/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.agent.push(r)
                    }
                    else if (r.name.match(/(.+)-datadog$/gm) || r.name.match(/(.+)-datadog-agent$/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.configManager.push(r)
                    }
                    else if (r.name.match(/^dd-trace-*/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.tracer.push(r)
                    }
                    else if (r.name.match(/^datadog-lambda-*/gm) || r.name.match(/^datadog-serverless-functions$/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.aws.push(r)
                    }
                    else if (r.name.match(/^helm-charts$/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.kube.push(r)
                    }
                    else if (r.name.match(/^dd-sdk-*/gm) || r.name.match(/^browser-sdk$/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.rum.push(r)
                    }
                    else if (r.name.match(/^datadog-api-client-*/gm)) {
                        r.release = await getReleses(r)
                        filteredResult.api.push(r)
                    }
                } catch(err:any) {
                    // don't add a repo with no latest release...
                }
            }))

            console.log(filteredResult)
    
            resolve(filteredResult)
        } catch(error:any) {
            // reject(error)
        }
    })
}

export {
    getRepos,
    filterRepos
}