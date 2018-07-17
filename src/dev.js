import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="0b28783360284d38ac9f0c580d6c4715"/>
  </Provider>,
  document.getElementById("app")
);