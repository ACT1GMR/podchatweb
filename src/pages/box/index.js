// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {chatSetInstance, chatSmallVersion, chatModalMediaInstance} from "../../actions/chatActions";
import {userGet} from "../../actions/userActions";

//components
import Aside from "./Aside";
import Main from "./Main";
import LeftAside from "./LeftAside";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";
import {ModalMedia} from "raduikit/src/modal";
import ModalContactList from "./ModalContactList";
import ModalAddContact from "./ModalAddContact";
import ModalThreadList from "./ModalThreadList";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalThreadInfo from "./ModalThreadInfo";
import ModalImageCaption from "./ModalImageCaption";
import ModalDeleteMessagePrompt from "./ModalDeleteMessagePrompt";

//styling
import style from "../../../styles/pages/box/index.scss";
import MainMessagesFileStyle from "../../../styles/pages/box/MainMessagesFile.scss";
import {Text} from "raduikit/src/typography";
import {threadCreate} from "../../actions/threadActions";


@connect(store => {
  return {
    chatInstance: store.chatInstance.chatSDK,
    user: store.user.user,
    threadShowing: store.threadShowing,
    leftAsideShowing: store.threadLeftAsideShowing,
    threadImages: store.threadLeftAsideShowing
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
    const {chatInstance, user, threadShowing, customClassName, leftAsideShowing, small, threadImages} = this.props;
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

    const modalMediaI18n = {
      fa: {
        CLOSE: strings.ModalMediaClose,
        NEXT: strings.ModalMediaNext,
        PREV: strings.ModalMediaPrev,
        ERROR: strings.ModalMediaError,
        PLAY_START: strings.ModalMediaPlayStart,
        PLAY_STOP: strings.ModalMediaPlayStop,
        FULL_SCREEN: strings.ModalMediaFullScreen,
        THUMBS: strings.ModalMediaThumbs,
        ZOOM: strings.ModalMediaZoom
      }
    };

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
        <ModalMedia selector={`.${MainMessagesFileStyle.MainMessagesFile__ImageContainer} a:visible`}
                    lang="fa"
                    i18n={modalMediaI18n}
                    backFocus={false}/>
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