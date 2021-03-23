import { init } from "@datadog/ui-apps-sdk";
import { setupModal } from "./modal";
import { setupWidgetCtxMenu } from "./widget-ctx-menu";
import { setupDashboardCogMenu } from "./dashboard-cog-menu";
import { useEffect } from "react";

const client = init({ debug: true });

// controller IFrame is hidden, empty react component
function Controller() {
  useEffect(() => {
    setupModal(client);
    setupWidgetCtxMenu(client);
    setupDashboardCogMenu(client);
  }, []);

  return null;
}

export default Controller;
