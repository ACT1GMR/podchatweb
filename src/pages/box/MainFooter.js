// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions

//components
import MainFooterInput from "./MainFooterInput";
import MainFooterAttachment from "./MainFooterAttachment";
import Container from "raduikit/src/container";

//styling
import style from "../../../styles/pages/box/MainFooter.scss";

@connect()
export default class MainFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container className={style.MainFooter}>
        <Container className={style.MainFooter__Input}>
          <MainFooterInput/>
        </Container>
        <Container className={style.MainFooter__Attachment}>
          <MainFooterAttachment/>
        </Container>
      </Container>
    );
  }
}