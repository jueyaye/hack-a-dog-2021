
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

import { getIntegrationChangelog, parseIntegrationChangelog, getIntegrationNames } from "../getIntegrationVersion";

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

    getIntegrationChangelog("airflow").then((res:JSON) => {
      const { latestIntegrationVersion, integrationReleaseDate } = parseIntegrationChangelog(res);
      console.log(latestIntegrationVersion);
      console.log(integrationReleaseDate);
      //console.log(res);
      //setLatestAgentVersion(latestIntegrationVersion);
      //setLatestReleseDate(latestReleseDate);
    })

    getIntegrationNames().then((res:JSON) => {
      console.log(res);
      //console.log(res);
      //setLatestAgentVersion(latestIntegrationVersion);
      //setLatestReleseDate(latestReleseDate);
    })
    
  }, []);

  const onOpenSidePanel = (args:any) => {  
    var xhr = new XMLHttpRequest()
    var completeResult = "";
    var a = 0;
    
    var listOfIntegrations = ["airflow", "activemq", "apache"];
    var baseUrl = "https://raw.githubusercontent.com/DataDog/integrations-core/master/";
    var completeUrl = "";
    for (var i = 0; i < listOfIntegrations.length; i++) {
      completeUrl = baseUrl + listOfIntegrations[i] + "/CHANGELOG.md";
      /*xhr.addEventListener('load', () => {
        // update the state of the component with the result here
        //console.log(xhr.responseText)
        console.log("triggered " + a++)
        completeResult = completeResult + xhr.responseText;
        
        
        
      })
      xhr.open('GET', completeUrl)
      // send the request
      xhr.send()*/
      setResultText("Result:")
      fetch(completeUrl).then(res => {
        console.log(res);
        //setResult(res)
      }).then((data) => {
        console.log(data);
          //
      })

      fetch(completeUrl).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
      ).then(res => {
          console.log(res.status, res.data.title)
      }));


      Promise.all([0, 1].map((index) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open("GET", completeUrl, true)
          xhr.onload = function() {
            if (xhr.readyState === 4) {
              if(xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText))
              } else {
                reject(xhr.statusText)
              }
          }
        }
        })
      })).then((json_objs) => {
        console.log(json_objs)
      }).catch(err => console.error(err))
    }
    
    
    
    
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
