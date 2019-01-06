// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {BrowserRouter, Route, withRouter} from "react-router-dom";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";
import {ROUTE_ADD_CONTACT, ROUTE_CONTACTS, ROUTE_CREATE_GROUP, ROTE_THREAD_INFO} from "../../constants/routes";

//actions
import {chatSetInstance, chatSmallVersion} from "../../actions/chatActions";
import {threadCreate, threadShowing} from "../../actions/threadActions";
import {userGet} from "../../actions/userActions";

//components
import Aside from "./Aside";
import Main from "./Main";
import LeftAside from "./LeftAside";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import {ModalMedia} from "../../../../uikit/src/modal";
import ModalContactList from "./ModalContactList";
import ModalAddContact from "./ModalAddContact";
import ModalThreadList from "./ModalThreadList";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalThreadInfo from "./ModalThreadInfo";
import ModalImageCaption from "./ModalImageCaption";
import ModalPrompt from "./ModalPrompt";

//styling

import style from "../../../styles/pages/box/index.scss";
import MainMessagesFileStyle from "../../../styles/pages/box/MainMessagesFile.scss";

@connect(store => {
  return {
    chatInstance: store.chatInstance.chatSDK,
    user: store.user.user,
    threadShowing: store.threadShowing,
    leftAsideShowing: store.threadLeftAsideShowing,
    threadImages: store.threadLeftAsideShowing
  };
}, null, null, {withRef: true})
class Box extends Component {
  constructor(props) {
    super(props);
    this.createThread = this.createThread.bind(this);
    this.modalDeleteMessagePromptRef = React.createRef(this.modalDeleteMessagePromptRef);
    this.modalThreadListRef = React.createRef(this.modalThreadListRef);
    this.modalMediaRef = React.createRef(this.modalMediaRef);
    this.modalImageCaptionRef = React.createRef(this.modalImageCaptionRef);
  }

  componentDidUpdate(oldProps) {
    const {token, location} = this.props;
    const {token: oldToken} = oldProps;
    if (oldProps.location.pathname !== location.pathname) {
      if (location.pathname === "/") {
        this.resetChat();
      }
    }
    if (oldToken) {
      if (oldToken !== token) {
        this.setToken(token);
      }
    }
  }

  resetChat() {
    const {dispatch} = this.props;
    dispatch(threadShowing(false));
    const closeModal = modal => modal.current.getWrappedInstance().onClose();
    closeModal(this.modalDeleteMessagePromptRef);
    closeModal(this.modalThreadListRef);
    closeModal(this.modalImageCaptionRef);
    this.modalMediaRef.current.close();
  }

  componentDidMount() {
    const {small, dispatch} = this.props;
    dispatch(chatSetInstance(this.props));
    if (small) {
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

  createThread(userId, idType) {
    this.props.dispatch(threadCreate(userId, null, null, idType));
  }

  render() {
    const {threadShowing, customClassName, leftAsideShowing, small} = this.props;
    let classNames = classnames({
      [customClassName]: customClassName,
      [style.Box]: true,
      [style["Box--small"]]: small,
      [style["Box--isThreadShow"]]: threadShowing,
      [style["Box--isAsideLeftShow"]]: leftAsideShowing
    });
    const modalMediaI18n = {
      fa: strings.modalMedia
    };
    const popups = (
      <Container>
        <Route exact path={ROUTE_CREATE_GROUP} render={props => <ModalCreateGroup smallVersion={small}/>}/>
        <Route exact path={ROUTE_CONTACTS} render={props => <ModalContactList smallVersion={small}/>}/>
        <Route exact path={ROUTE_ADD_CONTACT} render={props => <ModalAddContact smallVersion={small}/>}/>
        <Route exact path={ROTE_THREAD_INFO} render={props => <ModalThreadInfo smallVersion={small}/>}/>
        <ModalThreadList smallVersion={small} ref={this.modalThreadListRef}/>
        <ModalImageCaption smallVersion={small} ref={this.modalImageCaptionRef}/>
        <ModalMedia selector={`.${MainMessagesFileStyle.MainMessagesFile__ImageContainer} a:visible`}
                    ref={this.modalMediaRef}
                    lang="fa"
                    i18n={modalMediaI18n}
                    backFocus={false}/>
        <ModalPrompt smallVersion={small} ref={this.modalDeleteMessagePromptRef}/>
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

export default withRouter(Box);