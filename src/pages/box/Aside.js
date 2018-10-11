// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions

//components
import AsideHead from "./AsideHead";
import AsideThreads from "./AsideThreads";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/Aside.scss";

@connect()
export default class Aside extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className={style.Aside}>
        <AsideHead/>
        <AsideThreads/>
      </Container>
    );
  }
}