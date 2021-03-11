
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

import { getIntegrationChangelog, parseIntegrationChangelog, getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";

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

    getIntegrationChangelog("airflow").then((res:JSON) => {
      const { latestIntegrationVersion, integrationReleaseDate } = parseIntegrationChangelog(res);
      console.log(latestIntegrationVersion);
      console.log(integrationReleaseDate);
    })

    getIntegrationNames().then((res:JSON) => {
      const { listOfIntegrationNames, listOfIntegrationVersions } = parseIntegrationNames(res);
      console.log('this is the list of integrations')
      console.log(listOfIntegrationNames)
      console.log("list of versions")
      console.log(listOfIntegrationVersions)
      var listOfNamesInString = "";
      setResultHeading("Latest Integration Versions:")
      
      for (var i = 0; i < listOfIntegrationNames.length; i++) {
        listOfNamesInString += listOfIntegrationNames[i] + " " + listOfIntegrationVersions[i] + "\n";
      }
      setResult(listOfNamesInString)
      setResultHeading2(listOfIntegrationNames)
      

    })
    
  }, []);

  const onOpenSidePanel = (args:any) => {  
    var xhr = new XMLHttpRequest()
    var completeResult = "";
    var a = 0;


  }



  return (
    <section style={{ padding: "10px" }}>
      <h2>Agent Versions</h2>
      <p>Latest Datadog Agent version: {latestAgentVersion}</p>
      <p> Released on: {latestReleseDate}</p>
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <p><button className="button button-outline" onClick={onOpenSidePanel}>Show</button> </p>
      <h2>{resultHeading}</h2>
     
      {resultHeading2.map(item => (
            <li key={item}>{item}</li>
          ))}
    </section>
  );
}

export default Widget;
