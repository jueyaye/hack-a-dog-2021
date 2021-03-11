
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

import { getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";

import { getRepos, filterRepos } from "../getAltRepos"

function Widget() {
  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [result, setResult] = useState("");
  const [resultHeading, setResultHeading] = useState("");
  const [resultHeading2, setResultHeading2] = useState([""]);

  useEffect(() => {
    getRawAgentChangelog().then((res:JSON) => {
      const { latestAgentVersion, latestReleseDate } = parseRawAgentChangelog(res);

      setLatestAgentVersion(latestAgentVersion);
      setLatestReleseDate(latestReleseDate);
    })

    getIntegrationNames().then((res:JSON) => {
      const { listOfIntegrationNames, listOfIntegrationVersions } = parseIntegrationNames(res);
      var listOfNamesInString = "";
      setResultHeading("Latest Integration Versions:")
      
      for (var i = 0; i < listOfIntegrationNames.length; i++) {
        listOfNamesInString += listOfIntegrationNames[i] + " " + listOfIntegrationVersions[i] + "\n";
      }
      setResult(listOfNamesInString)
      setResultHeading2(listOfIntegrationNames)
    })

    getRepos(1).then((res:any) => {
      console.log(res)

      filterRepos(res).then((repos:any) => {
        console.log(repos)
      })
    })
  }, []);

  return (
    <section style={{ padding: "10px" }}>
      <h2>Agent Versions</h2>
      <p>Latest Datadog Agent version: {latestAgentVersion}</p>
      <p> Released on: {latestReleseDate}</p>
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <h2>{resultHeading}</h2>
     
      {resultHeading2.map(item => (
            <li key={item}>{item}</li>
          ))}
    </section>
  );
}

export default Widget;
