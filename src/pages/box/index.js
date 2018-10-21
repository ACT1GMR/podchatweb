// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {chatSetInstance, chatSmallVersion} from "../../actions/chatActions";
import {userGet} from "../../actions/userActions";

//components
import Aside from "./Aside";
import Main from "./Main";
import LeftAside from "./LeftAside";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";
import ModalContactList from "./ModalContactList";
import ModalAddContact from "./ModalAddContact";
import ModalThreadList from "./ModalThreadList";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalThreadInfo from "./ModalThreadInfo";
import ModalMedia from "./ModalMedia";
import ModalImageCaption from "./ModalImageCaption";
import ModalDeleteMessagePrompt from "./ModalDeleteMessagePrompt";

//styling
import style from "../../../styles/pages/box/index.scss";


@connect(store => {
  return {
    chatInstance: store.chatInstance.chatSDK,
    user: store.user.user,
    threadShowing: store.threadShowing,
    leftAsideShowing: store.threadLeftAsideShowing
  };
}, null, null, {withRef: true})
export default class Box extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    const {token} = this.props;
    const {token: oldToken} = oldProps;
    if (oldToken) {
      if (oldToken !== token) {
        this.setToken(token);
      }
    }
  }

  componentDidMount() {
    const {small, dispatch} = this.props;
    dispatch(chatSetInstance(this.props));
    if(small){
      dispatch(chatSmallVersion(small))
    }
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
    const {chatInstance, user, threadShowing, customClassName, leftAsideShowing, small} = this.props;
    let classNames = classnames({
      [style.Box]: true,
      [style["Box--small"]]: small,
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
      [style["Box--isThreadShow"]]: threadShowing,
      [style["Box--isAsideLeftShow"]]: leftAsideShowing
    })}`;

    const popups = (
      <Container>
        <ModalDeleteMessagePrompt smallVersion={small}/>
        <ModalContactList smallVersion={small}/>
        <ModalAddContact smallVersion={small}/>
        <ModalThreadList smallVersion={small}/>
        <ModalCreateGroup smallVersion={small}/>
        <ModalThreadInfo smallVersion={small}/>
        <ModalMedia smallVersion={small}/>
        <ModalImageCaption smallVersion={small}/>
      </Container>
    );

    return (
      <Container className={classNames}>
        {popups}
        <Container className={style.Box__Aside}>
          <Aside/>
        </Container>
        <Container className={style.Box__Main}>
          <Main/>
        </Container>
        <Container className={style.Box__AsideLeft}>
          <LeftAside/>
        </Container>
      </Container>
    );
  }
}