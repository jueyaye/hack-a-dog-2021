import { DDClient } from "@datadog/ui-apps-sdk/dist/client/client";
import {
  UiAppEventType,
  ModalSize,
  ModalActionLevel,
} from "@datadog/ui-apps-sdk";

export const setupDashboardCogMenu = (client: DDClient) => {
  // provide cog menu items dynamically if needed
  client.dashboardCogMenu.onRequest(() => {
    return {
      items: [],
    };
  });

  // listen for cog menu click events
  client.events.on(UiAppEventType.DASHBOARD_COG_MENU_CLICK, (context) => {
    if (context.menuItem.key === "open-confirmation") {
      client.modal.open({
        actionLabel: "Yes",
        cancelLabel: "Nevermind",
        title: "Please verify!",
        key: "confirmation-modal",
        actionLevel: ModalActionLevel.DANGER,
        isCloseable: true,
        message: "Are you sure really sure?",
        size: ModalSize.MEDIUM,
      });
    }

    // open an iframe modal defined inline here in controller
    if (context.menuItem.key === "open-custom-modal") {
      client.modal.open({
        key: "custom-modal",
        size: ModalSize.LARGE,
        isCloseable: true,
        source: "modal",
      });
    }

    // open an iframe side panel defined inline here in controller
    if (context.menuItem.key === "open-custom-panel") {
      client.sidePanel.open(
        {
          key: "custom-panel-from-controller",
          source: "panel",
        },
        {
          message: "Hi! I was sent here from the cog menu 👋",
        }
      );
    }
  });
};
