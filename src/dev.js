import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="d39f8f9db8e847e29b09c5dab17414b1"/>
  </Provider>,
  document.getElementById("app")
);