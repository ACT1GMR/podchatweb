// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {chatSetInstance} from "../../actions/chatActions";
import {userGet} from "../../actions/userActions";

//components
import BoxThreads from "./BoxThreads";
import BoxScene from "./BoxScene";
import BoxHead from "./BoxHead";

import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import Loading from "raduikit/src/loading";
import LoadingBlinkDots from "raduikit/src/loading/LoadingBlinkDots";

//styling
import style from "../../../styles/pages/box/index.scss";


@connect(store => {
  return {
    chatInstance: store.chat.chatSDK,
    user: store.user.user
  };
})
export default class Box extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(chatSetInstance(this.props.token));
  }

  componentWillUpdate(chatInstance) {
    if (chatInstance.chatInstance && !this.props.user) {
      this.props.dispatch(userGet(chatInstance.chatInstance));
    }
  }

  render() {
    if (!this.props.chatInstance || !this.props.user) {
      return (
        <Container className={style.Box}>
          <Container center={true}>
            <Message large={true}>{strings.waitingForChatInstance}</Message>
            <Loading><LoadingBlinkDots/></Loading>
          </Container>
        </Container>
      );
    }
    return (
      <section className={style.Box}>
        <section className={style.Box__Head}>
          <BoxHead/>
        </section>
        <section className={style.Box__Body}>
          <BoxThreads/>
          <BoxScene/>
        </section>
      </section>
    );
  }
}