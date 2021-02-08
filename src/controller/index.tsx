import {
  init,
  UiAppEventType,
  ModalSize,
  MenuItemType,
  ModalActionLevel,
} from "@datadog/ui-apps-sdk";
import { useEffect } from "react";

const client = init({ debug: true });

const initController = () => {
  // provide cog menu items dynamically
  client.dashboardCogMenu.onRequest(() => {
    return {
      items: [
        {
          href: "https://www.google.com",
          type: MenuItemType.LINK,
          key: "link-item",
          label: "Open a link",
        },
        {
          type: MenuItemType.EVENT,
          key: "open-custom-modal",
          label: "Open a custom modal",
        },
        {
          type: MenuItemType.EVENT,
          key: "open-custom-panel",
          label: "Open a custom side panel with args",
        },
      ],
    };
  });

  // provide widget context menu items dynamically
  client.widgetContextMenu.onRequest(({ widget }) => {
    return {
      items: [
        {
          href: `https://docs.datadoghq.com/dashboards/widgets/${widget.definition.type}/`,
          type: MenuItemType.LINK,
          key: "link-item",
          label: `Read about ${widget.definition.type} widgets`,
        }
      ],
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
        size: ModalSize.MEDIUM
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

  // listen for modal events
  client.events.on(UiAppEventType.MODAL_ACTION, () => {
    console.log("Confirmed!");
  });

  client.events.on(UiAppEventType.MODAL_CANCEL, () => {
    console.log("Denied!");
  });

  client.events.on(UiAppEventType.MODAL_CLOSE, (definition) => {
    console.log(`User exited modal ${definition.key}`);
  });

  // listen for a custom event sent from modal IFrame
  client.events.onCustom("modal_button_click", (count: number) => {
    console.log(`The user has clicked the button ${count} times`);
  });
};

// controller IFrame is hidden, empty react component
function Controller() {
  useEffect(initController, []);

  return null;
}

export default Controller;
