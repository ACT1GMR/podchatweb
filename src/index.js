import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import '../styles/main.scss';
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="6f5053dca67f41d4ba899f7bb1118ae6"/>
  </Provider>,
  document.getElementById("app")
);

function Podchat(props) {
  return (
    <Provider store={store}>
      <Box {...props}/>
    </Provider>
  )
}

export {Podchat};