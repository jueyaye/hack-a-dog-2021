
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

import { getIntegrationChangelog, parseIntegrationChangelog, getIntegrationNames } from "../getIntegrationVersion";

import { getRepos, filterRepos } from "../getAltRepos"

function Widget() {
  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [result, setResult] = useState("");
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    getRawAgentChangelog().then((res:JSON) => {
      const { latestAgentVersion, latestReleseDate } = parseRawAgentChangelog(res);

      setLatestAgentVersion(latestAgentVersion);
      setLatestReleseDate(latestReleseDate);
    })

    // getIntegrationChangelog("airflow").then((res:JSON) => {
    //   const { latestIntegrationVersion, integrationReleaseDate } = parseIntegrationChangelog(res);
    //   console.log(latestIntegrationVersion);
    //   console.log(integrationReleaseDate);
    //   //console.log(res);
    //   //setLatestAgentVersion(latestIntegrationVersion);
    //   //setLatestReleseDate(latestReleseDate);
    // })

    // getIntegrationNames().then((res:JSON) => {
    //   console.log(res);
    //   //console.log(res);
    //   //setLatestAgentVersion(latestIntegrationVersion);
    //   //setLatestReleseDate(latestReleseDate);
    // })

    getRepos(1).then((res:unknown) => {
      filterRepos(res).then((repos:unknown) => {
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
      <h2>{resultText}</h2>
      <p>{result}</p>
    </section>
  );
}

export default Widget;
