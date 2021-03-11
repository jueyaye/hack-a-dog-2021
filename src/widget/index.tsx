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
    console.log("hello");

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
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <p><button className="button button-outline" onClick={onOpenSidePanel}>Show</button> </p>
      <h2>{resultText}</h2>
      <p>{result}</p>
    </section>
  );
}

export default Widget;
