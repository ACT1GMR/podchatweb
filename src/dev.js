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
  clientId: "2051121e4348af52664cf7de0bda",
  scope: "social:write",
  onNewToken: token => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Box token={token} enableCache fullResponseObject dynamicHistoryCount/>
        </BrowserRouter>
      </Provider>,
      document.getElementById("app")
    );
  }
});

