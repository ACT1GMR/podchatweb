// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {chatSetInstance} from "../../actions/chatActions";
import {userGet} from "../../actions/userActions";

//components
import Aside from "./Aside";
import Main from "./Main";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";

//styling
import style from "../../../styles/pages/box/index.scss";


@connect(store => {
  return {
    chatInstance: store.chat.chatSDK,
    user: store.user.user,
    threadShowing: store.threadShowing
  };
}, null, null, {withRef: true})
export default class Box extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    const {token} = this.props;
    if (oldProps.token) {
      if (oldProps.token !== token) {
        this.setToken(token);
      }
    }
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
    const {chatInstance, user, threadShowing, customClassName} = this.props;
    let classNames = classnames({
      [style.Box]: true,
      [customClassName]: customClassName
    });

    if (!chatInstance || !user) {
      return (
        <Container className={classNames}>
          <Container center centerTextAlign className={style.Box__MessageContainer}>
            <Message size="lg">{strings.waitingForChatInstance}</Message>
            <Loading hasSpace><LoadingBlinkDots/></Loading>
          </Container>
        </Container>
      );
    }

    classNames += ` ${classnames({
      [style["Box--isThreadShow"]]: threadShowing
    })}`;

    return (
      <Container className={classNames}>
        <Container className={style.Box__Aside}>
          <Aside/>
        </Container>
        <Container className={style.Box__Main}>
          <Main/>
        </Container>
      </Container>
    );
  }
}