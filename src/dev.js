import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import "../styles/layout/defualt.scss";
import Box from "./pages/box";
import {auth} from "podauth";

auth({
  clientId: "84994fec93b1402825b650dba",
  scope: "social:write",
  onNewToken: token => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Box token={token}/>
        </BrowserRouter>
      </Provider>,
      document.getElementById("app")
    );
  }
});

