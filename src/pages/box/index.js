// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {setChatInstance} from "../../actions/chatActions";
import {getUser} from "../../actions/userActions";

//components
import BoxThreads from "./BoxThreads";
import BoxScene from "./BoxScene";

import Container from "../../../ui_kit/components/container";
import Message from "../../../ui_kit/components/message";
import Loading from "../../../ui_kit/components/loading";
import LoadingBlinkDots from "../../../ui_kit/components/loading/LoadingBlinkDots";


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
    this.props.dispatch(setChatInstance(this.props.token));
  }

  componentWillUpdate(chatInstance) {
    if (chatInstance.chatInstance && !this.props.user) {
      this.props.dispatch(getUser(chatInstance.chatInstance));
    }
  }

  render() {
    if (!this.props.chatInstance || !this.props.user) {
      return (
        <div className={style.Box}>
          <Container center={true}>
            <Message large={true}>{strings.waitingForChatInstance}</Message>
            <Loading><LoadingBlinkDots/></Loading>
          </Container>
        </div>
      );
    }
    return (
      <div className={style.Box}>
        <BoxThreads/>
        <BoxScene/>
      </div>
    );
  }
}