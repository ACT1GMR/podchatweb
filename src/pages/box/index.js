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
import BoxNotification from "./BoxNotification";

import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";

//styling
import style from "../../../styles/pages/box/index.scss";


@connect(store => {
  return {
    chatInstance: store.chat.chatSDK,
    user: store.user.user
  };
}, null, null, {withRef: true})
export default class Box extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(chatSetInstance(this.props));
  }

  componentWillUpdate(chatInstance) {
    if (chatInstance.chatInstance && !this.props.user) {
      this.props.dispatch(userGet(chatInstance.chatInstance));
    }
  }

  setToken(token) {
    if (this.props.chatInstance) {
      this.props.chatInstance.setToken(token);
    }
  }

  render() {
    const className = `${style.Box} Podchatbox`;
    const classNameBody = `${style.Box__Body} Podchatboxbody`;
    if (!this.props.chatInstance || !this.props.user) {
      return (
        <Container className={className}>
          <Container center>
            <Message size="lg">{strings.waitingForChatInstance}</Message>
            <Loading hasSpace><LoadingBlinkDots/></Loading>
          </Container>
        </Container>
      );
    }
    return (
      <section className={className}>
        <section className={style.Box__Head}>
          <BoxHead/>
        </section>
        <section className={classNameBody}>
          <BoxThreads/>
          <BoxScene/>
          <BoxNotification/>
        </section>
      </section>
    );
  }
}