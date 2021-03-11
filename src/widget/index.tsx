import { init, UiAppEventType } from "@datadog/ui-apps-sdk";

import "./widget.css";
import "typeface-roboto";
import "milligram";
import { useEffect, useState } from "react";

const client = init ({ debug: true });

function Widget() {
  const [name, setName] = useState("Datadog user");
  const [metric, setMetric] = useState("system.cpu.idle");
  const [broadcastClickCount, setBroadcastClickCount] = useState(0);
  const [result, setResult] = useState("");
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    client.getContext().then(c => {
      setName(c.app.currentUser.handle);
      setMetric(c.widget?.definition.options?.metric);
    })

    client.events.on(
      UiAppEventType.DASHBOARD_CUSTOM_WIDGET_OPTIONS_CHANGE,
      ({ metric }) => {
        setMetric(metric);
      }
    );

    client.events.onCustom('modal_button_click', setBroadcastClickCount)
  }, []);

  const onOpenSidePanel = (args:any) => {  
    /*client.sidePanel.open(
      {
        willCloseOnEsc: true,
        width: "50%",
        source: "panel",
        key: "custom-side-panel",
        hideCloseButton: false,
      },
      { metric }
    )*/

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
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <p><button className="button button-outline" onClick={onOpenSidePanel}>Show</button> </p>
      <h2>{resultText}</h2>
      <p>{result}</p>
    </section>
  );
}

export default Widget;
