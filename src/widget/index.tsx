
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

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
    
  }, []);

  const onOpenSidePanel = (args:any) => {  
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log(xhr.responseText)
      setResult(xhr.responseText)
      setResultText("Result")
    })
    xhr.open('GET', 'https://raw.githubusercontent.com/DataDog/integrations-core/master/AGENT_INTEGRATIONS.md')
    // send the request
    xhr.send()
  }



  return (
    <section style={{ padding: "10px" }}>
      <h2>Agent Versions</h2>
      <p>Latest Datadog Agent version: {latestAgentVersion}</p>
      <p> Released on: {latestReleseDate}</p>

      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <p><button className="button button-outline" onClick={onOpenSidePanel}>Show</button> </p>
      <h2>{resultText}</h2>
      <p>{result}</p>
    </section>
  );
}

export default Widget;
