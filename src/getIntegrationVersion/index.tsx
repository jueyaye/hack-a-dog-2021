const axios = require('axios')

const INTEGRATION_BASEURL = "https://raw.githubusercontent.com/DataDog/integrations-core/master/"
const INTEGRATION_REPO_HOMEURL = "https://raw.githubusercontent.com/DataDog/integrations-core/master/requirements-agent-release.txt"

const getIntegrationChangelog = (integration_name:string) => {

    var completeUrl = INTEGRATION_BASEURL + integration_name + "/CHANGELOG.md";
    
    return axios.get(completeUrl)
}

const getIntegrationNames = () => {
    
    return axios.get(INTEGRATION_REPO_HOMEURL)
}

const parseIntegrationChangelog = (rawLogs:any) => {
    const arrRawLogs = rawLogs.data.split(/\r?\n/)

    let latestIntegrationVersion = 'N/A'
    let integrationReleaseDate = 'N/A'

    for(const index in arrRawLogs) {
        if (arrRawLogs[index].match(/^## (\d+\.)?(\d+\.)?(\*|\d+) \/ ([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/gm)){
            [latestIntegrationVersion, integrationReleaseDate] = arrRawLogs[index].split(' / ');
            latestIntegrationVersion = latestIntegrationVersion.split(' ')[1]
            break;
        }
    }


    return {
        latestIntegrationVersion,
        integrationReleaseDate
    }
}

const parseIntegrationNames = (rawLogs:any) => {
    const arrRawLogs = rawLogs.data.split(/\r?\n/)

    var listOfIntegrationNames = new Array("");
    var listOfIntegrationVersions = new Array("");
    var versionNumber = "";
    var extractString = "";
    var integrationNameParts = [""];
    var firstPart = "";
    
    for(var index = 0; index < arrRawLogs.length; index++) {
        var integrationName = "";
        extractString = arrRawLogs[index].split(';')[0]
        firstPart = arrRawLogs[index].split('==')[0]

        versionNumber = extractString.split('==')[1];
        integrationNameParts = firstPart.split('-');
        for (var i = 1; i < integrationNameParts.length; i++) {
            if (i == 1) {
                integrationName = integrationNameParts[i];
            } else {
                integrationName = integrationName + " " + integrationNameParts[i];
            }
        }
        listOfIntegrationNames[index] = integrationName + " - " + versionNumber;
    }


    return {
        listOfIntegrationNames,
        listOfIntegrationVersions
    }
}

export {
    getIntegrationChangelog,
    parseIntegrationChangelog,
    getIntegrationNames,
    parseIntegrationNames
}