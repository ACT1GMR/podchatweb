// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import {Route, withRouter} from "react-router-dom";
import {statics as contactListStatics} from "./ModalContactList";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";
import {
  ROUTE_ADD_CONTACT,
  ROUTE_CONTACTS, ROUTE_CREATE_CHANNEL,
  ROUTE_CREATE_GROUP, ROUTE_THREAD,
  ROUTE_THREAD_INFO
} from "../../constants/routes";

//actions
import {chatClearCache, chatRouterLess, chatSetInstance, chatSmallVersion} from "../../actions/chatActions";
import {threadCreate, threadParticipantList, threadShowing} from "../../actions/threadActions";
import {userGet} from "../../actions/userActions";

//components
import Aside from "./Aside";
import Main from "./Main";
import LeftAside from "./LeftAside";
import Container from "../../../../uikit/src/container";
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
import {contactGetList} from "../../actions/contactActions";

@connect(store => {
  return {
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    user: store.user.user,
    userFetching: store.user.fetching,
    threadShowing: store.threadShowing,
    leftAsideShowing: store.threadLeftAsideShowing.isShowing,
    thread: store.thread.thread
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
    this.firstContactFetching = true;
    this.deletingDatabases = false;
  }

  componentDidUpdate(oldProps) {
    const {token, location, user, userFetching, chatInstance, dispatch, clearCache, thread} = this.props;
    const {token: oldToken, thread: oldThread} = oldProps;

    if ((oldThread.id !== thread.id) || (!oldThread.id && thread.id)) {
      if (thread.type === 8) {
        if (thread.inviter.id === user.id) {
          dispatch(threadParticipantList(thread.id));
        }
      } else {
        dispatch(threadParticipantList(thread.id));
      }
    }

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
    if (this.firstContactFetching) {
      dispatch(contactGetList(contactListStatics.offset, contactListStatics.count));
      this.firstContactFetching = false;
    }
    if (chatInstance) {
      if (clearCache && !this.deletingDatabases) {
        this.deletingDatabases = true;
        dispatch(chatClearCache());
      }
      if (!user.id) {
        if (!userFetching) {
          dispatch(userGet(chatInstance));
        }
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
    const {small, routerLess, dispatch} = this.props;
    dispatch(chatSetInstance(this.props));
    if (small) {
      dispatch(chatSmallVersion(small))
    }
    if (routerLess) {
      dispatch(chatRouterLess(routerLess))
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
    const {threadShowing, customClassName, leftAsideShowing, small, chatRouterLess} = this.props;
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
        <Route exact={!chatRouterLess} path={chatRouterLess ? "" : [ROUTE_CREATE_GROUP, ROUTE_CREATE_CHANNEL]}
               render={() => <ModalCreateGroup smallVersion={small}/>}/>
        <Route exact={!chatRouterLess} path={chatRouterLess ? "" : ROUTE_CONTACTS}
               render={() => <ModalContactList smallVersion={small}/>}/>
        <Route exact={!chatRouterLess} path={chatRouterLess ? "" : ROUTE_ADD_CONTACT}
               render={() => <ModalAddContact smallVersion={small}/>}/>
        <Route exact={!chatRouterLess} path={chatRouterLess ? "" : ROUTE_THREAD_INFO}
               render={() => <ModalThreadInfo smallVersion={small}/>}/>
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