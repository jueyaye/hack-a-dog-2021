import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Controller from "./controller";
import Modal from "./modal";
import SidePanel from "./side-panel";
import Widget from "./widget";

const getContent = () => {
  console.log(window.location.pathname);
  switch (window.location.pathname) {
    case "/widget": {
      return <Widget />;
    }
    case "/modal": {
      return <Modal />;
    }
    case "/panel": {
      return <SidePanel />;
    }
    default: {
      return <Controller />;
    }
  }
};

ReactDOM.render(
  <React.StrictMode>{getContent()}</React.StrictMode>,
  document.getElementById("root")
);
