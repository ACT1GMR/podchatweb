import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";
import {auth} from "podauth";

let instance;

auth({
  clientId: "2051121e4348af52664cf7de0bda",
  onNewToken: token => {
    render(
      <Provider store={store}>
        <Box token={token} ref={e => instance = e}/>
      </Provider>,
      document.getElementById("app")
    );
  }
});

