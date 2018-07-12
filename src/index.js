import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";

render(
  <Provider store={store}>
    <Box token="0f6946a753064b77b3440936c2e0e712"/>
  </Provider>,
  document.getElementById("app")
);

function PodchatReact(props) {
  return (
    <Provider store={store}>
      <Box {...props}/>
    </Provider>
  )
}

function Podchat(token, elementId) {
  render(
    <Provider store={store}>
      <Box token={token}/>
    </Provider>,
    document.getElementById(elementId)
  );
}

export {PodchatReact, Podchat};