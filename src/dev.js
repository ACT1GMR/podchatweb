import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="4e860f8663f441cd94d4da2f14312595"/>
  </Provider>,
  document.getElementById("app")
);