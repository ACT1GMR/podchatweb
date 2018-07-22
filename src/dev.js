import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="2a2be8d4418d4dbb883a52c4b7fafa0e"/>
  </Provider>,
  document.getElementById("app")
);