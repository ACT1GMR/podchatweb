import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import '../styles/main.scss';
import Box from "./pages/box";

function Podchat(props) {
  return (
    <Provider store={store}>
      <Box {...props}/>
    </Provider>
  )
}

export {Podchat};