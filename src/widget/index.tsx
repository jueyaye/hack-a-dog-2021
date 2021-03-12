import { useEffect, useState } from "react";

// helpers
import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";
import { getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";
import { getRepos, filterRepos } from "../getAltRepos"

// components
import VersionCard from "../versionCard"

function Widget() {
  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [result, setResult] = useState([] as {name:string, version:string}[]);

  useEffect(() => {
    getRawAgentChangelog().then((res:JSON) => {
      const { latestAgentVersion, latestReleseDate } = parseRawAgentChangelog(res);

      setLatestAgentVersion(latestAgentVersion);
      setLatestReleseDate(latestReleseDate);
    })

    getIntegrationNames().then((res:JSON) => {
      const { listOfIntegrationObjs } = parseIntegrationNames(res);

      setResult(listOfIntegrationObjs)

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
     
      { result.map((item, i) => (
        <VersionCard item={item}/>
      )) }

    </section>
    
  );
}

export default Widget;
