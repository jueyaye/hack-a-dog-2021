const axios = require('axios')
const { setupCache } = require('axios-cache-adapter')

const GITHUB_BASE_URL = 'https://api.github.com'

const cache = setupCache({
    maxAge: 15 * 60 * 1000
})
const api = axios.create({
    adapter: cache.adapter
})

const getRepos = (page:number) => {
    let repos: any[] = []

    return new Promise(async (resolve:any, reject:any) => {
        try {
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
        } catch(error:any) {
            reject(error)
        }
    })
}

const getReleses = async (repo:any) => {
    return new Promise(async (resolve:any, reject:any) => {
        try {
            let releases = await api.get(`${GITHUB_BASE_URL}/repos/DataDog/${repo.name}/releases/latest`)

            resolve(releases.data)
        } catch(error:any) {
            reject(error)
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
                if (r.name.match(/^dd-agent$/gm) || r.name.match(/^datadog-agent$/gm)) {
                    r.release = await getReleses(r)
                    filteredResult.agent.push(r)
                }
                else if (r.name.match(/(.+)-datadog$/gm)) {
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
            }))
    
            resolve(filteredResult)
        } catch(error:any) {
            reject(error)
        }
    })
}

export {
    getRepos,
    filterRepos
}