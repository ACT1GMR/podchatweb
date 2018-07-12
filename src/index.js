import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

function PodchatReact(props) {
  return (
    <Provider store={store}>
      <Box {...props}/>
    </Provider>
  )
}

function Podchat(props, elementId) {
  render(
    <Provider store={store}>
      <Box {...props}/>
    </Provider>,
    document.getElementById(elementId)
  );
}

export {PodchatReact, Podchat};