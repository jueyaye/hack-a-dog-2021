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
    client.sidePanel.open(
      {
        willCloseOnEsc: true,
        width: "50%",
        source: "panel",
        key: "custom-side-panel",
        hideCloseButton: false,
      },
      { metric }
    )
  }

  return (
    <section style={{ padding: "10px" }}>
      <h2>Hello {name} 👋</h2>
      <p>Welcome to your first Datadog application.</p>
      <p>Your favorite metric is: <strong>{metric}</strong></p>
      <p>You can open a side panel programatically and pass to it your favorite metric by clicking <button className="button button-outline" onClick={onOpenSidePanel}>here</button> </p>
      <p>The red button in the modal has been clicked: <strong>{broadcastClickCount}</strong> time(s)</p>
    </section>
  );
}

export default Widget;
