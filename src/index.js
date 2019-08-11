import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import "../styles/main.scss";
import Box from "./pages/box";
import {BrowserRouter} from "react-router-dom";


function PodchatJSX(props) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Box {...props}/>
      </BrowserRouter>
    </Provider>
  );
}

function Podchat(props, elementId) {
  let instance;
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Box {...props} wrappedComponentRef={e => instance = e}/>
      </BrowserRouter>
    </Provider>,
    document.getElementById(elementId)
  );
  return instance.getWrappedInstance();
}

export {PodchatJSX, Podchat};

window.Podchat = Podchat;