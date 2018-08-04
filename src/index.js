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
  let instance;
  render(
    <Provider store={store}>
      <Box {...props} ref={e => instance = e}/>
    </Provider>,
    document.getElementById(elementId)
  );
  return instance.getWrappedInstance();
}

export {PodchatReact, Podchat};