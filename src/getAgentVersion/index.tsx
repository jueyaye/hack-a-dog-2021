const axios = require('axios')

const AGENT_CHANGELOG = 'https://raw.githubusercontent.com/DataDog/datadog-agent/master/CHANGELOG.rst'

const getRawAgentChangelog = () => {
    return axios.get(AGENT_CHANGELOG)
}

const parseRawAgentChangelog = (rawLogs:any) => {
    const arrRawLogs = rawLogs.data.split(/\r?\n/)

    let latestAgentVersion = 'N/A'
    let latestReleseDate = 'N/A'

    for(const index in arrRawLogs) {
        if (arrRawLogs[index].match(/^(\d+\.)?(\d+\.)?(\*|\d+)/gm)){
            latestAgentVersion = arrRawLogs[index]
        }

        if (latestAgentVersion != 'N/A' && arrRawLogs[index].match(/^Release on: ([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/gm)) {
            latestReleseDate = arrRawLogs[index].split('Release on: ')[1]
            break
        }
    }

    return {
        latestAgentVersion,
        latestReleseDate
    }
}

export {
    getRawAgentChangelog,
    parseRawAgentChangelog
}