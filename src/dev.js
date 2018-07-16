import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="f4024e2e051c478bb3fa211258a434a0"/>
  </Provider>,
  document.getElementById("app")
);