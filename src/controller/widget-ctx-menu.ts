import { MenuItemType, UiAppEventType, DDClient } from "@datadog/ui-apps-sdk";

export const setupWidgetCtxMenu = (client: DDClient) => {
  // provide widget context menu items dynamically
  client.widgetContextMenu.onRequest(({ widget }) => {
    return {
      items: [
        {
          href: `https://docs.datadoghq.com/dashboards/widgets/${widget.definition.type}/`,
          type: MenuItemType.LINK,
          key: "link-item",
          label: `Read about ${widget.definition.type} widgets`,
        },
        {
          type: MenuItemType.EVENT,
          // this key is used below to determine which action to take upon click
          key: "sidepanel-trigger",
          label: `Open a sidepanel`,
        },
      ],
    };
  });

  // listen for ctx menu click events

  client.events.on(UiAppEventType.WIDGET_CONTEXT_MENU_CLICK, (context) => {
    if (context.menuItem.key === "sidepanel-trigger") {
      client.sidePanel.open(
        {
          key: "custom-panel-from-controller",
          source: "panel",
        },
        {
          message: "Hi! I was sent here from the widget context menu 👋",
        }
      );
    }
  });
};
