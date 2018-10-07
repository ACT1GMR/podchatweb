// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions

//components
import LeftAsideHead from "./LeftAsideHead";
import LeftAsideMain from "./LeftAsideMain";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/LeftAside.scss";

@connect()
export default class Aside extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className={style.LeftAside}>
        <LeftAsideHead/>
        <LeftAsideMain/>
      </Container>
    );
  }
}