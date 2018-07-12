import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="f8113405105e40418829e0bb5e2f7117"/>
  </Provider>,
  document.getElementById("app")
);