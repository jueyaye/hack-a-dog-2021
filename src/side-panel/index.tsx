import { init } from "@datadog/ui-apps-sdk";
import { useState, useEffect } from 'react';

const client = init ({ debug: true });

function SidePanel() {

  const [args, setArgs] = useState<any>();

  
  useEffect(() => {
    client.getContext().then(({ args }) => setArgs(args));
  }, [setArgs])


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <p>This side panel was opened programatically with these args </p>
        <blockquote style={{backgroundColor: '#333', color: '#fff'}}>
          <p><em>{JSON.stringify(args)}</em></p>
        </blockquote>
    </div>
  );
}

export default SidePanel;
