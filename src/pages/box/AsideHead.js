// src/list/Avatar.scss
import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {OnWindowFocusInOut} from "../../utils/helpers";
//strings
import strings from "../../constants/localization";
import {
  CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_CHANNEL_SHOWING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING
} from "../../constants/actionTypes";
import {ROUTE_ADD_CONTACT, ROUTE_CONTACTS, ROUTE_CREATE_CHANNEL, ROUTE_CREATE_GROUP} from "../../constants/routes";

//actions
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";

//UI components
import {MdMenu, MdClose, MdSearch, MdEdit, MdArrowBack} from "react-icons/md";
import Notification from "./Notification";
import Dropdown, {DropdownItem} from "../../../../uikit/src/menu/Dropdown";
import {ButtonFloating} from "../../../../uikit/src/button"
import {Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";

//styling
import style from "../../../styles/pages/box/AsidHead.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import classnames from "classnames";
import {chatSearchShow} from "../../actions/chatActions";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import {avatarNameGenerator} from "../../utils/helpers";
import Gap from "../../../../uikit/src/gap";

const statics = {
  headMenuSize: 59
};

function routeChange(history, route, chatRouterLess) {
  if (!chatRouterLess) {
    history.push(route);
  }
}

@connect(store => {
  return {
    threadId: store.thread.thread.id,
    chatState: store.chatState,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    chatSearchShowing: store.chatSearchShow,
    chatRetryHook: store.chatRetryHook,
    chatSignOutHook: store.chatSignOutHook,
    smallVersion: store.chatSmallVersion,
    user: store.user.user
  };
})
class AsideHead extends Component {

  static defaultProps = {
    menuItems: [
      {
        name: strings.addContact,
        type: CONTACT_ADDING
      },
      {
        name: strings.contactList,
        type: CONTACT_LIST_SHOWING
      },
      {
        name: strings.createGroup(),
        type: CONTACT_MODAL_CREATE_GROUP_SHOWING
      },
      {
        name: strings.createGroup(true),
        type: CONTACT_MODAL_CREATE_CHANNEL_SHOWING
      },
      {
        name: strings.signedOut,
        type: "CHAT_SIGN_OUT"
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      reConnecting: false
    };
    this.container = React.createRef();
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.onRetryClick = this.onRetryClick.bind(this);
    this.onChatSearchToggle = this.onChatSearchToggle.bind(this);
    OnWindowFocusInOut(null, e => {
      const {isDisconnected} = this.socketStatus();
      if(isDisconnected) {
        if(!this.state.reConnecting) {
          this.onRetryClick();
        }
      }
    })
  }

  componentDidUpdate(prevProps) {
    const {reConnecting} = this.state;
    if (reConnecting) {
      const {isConnected} = this.socketStatus();
      if (isConnected) {
        this.setState({
          reConnecting: false
        });
      }
    }
  }

  onMenuSelect(type) {
    const {history, chatRouterLess, dispatch} = this.props;
    switch (type) {
      case CONTACT_ADDING:
        dispatch(contactAdding(true));
        routeChange(history, ROUTE_ADD_CONTACT, chatRouterLess);
        break;
      case CONTACT_LIST_SHOWING:
        dispatch(contactListShowing(true));
        routeChange(history, ROUTE_CONTACTS, chatRouterLess);
        break;
      case CONTACT_MODAL_CREATE_GROUP_SHOWING:
        dispatch(contactModalCreateGroupShowing(true));
        routeChange(history, ROUTE_CREATE_GROUP, chatRouterLess);
        break;
      case CONTACT_MODAL_CREATE_CHANNEL_SHOWING:
        dispatch(contactModalCreateGroupShowing(true, true));
        routeChange(history, ROUTE_CREATE_CHANNEL, chatRouterLess);
        break;
      default: {
        const {chatSignOutHook} = this.props;
        if (chatSignOutHook) {
          chatSignOutHook();
        }
      }
    }
  }

  onCloseMenu() {
    this.setState({
      isOpen: false
    });
  }

  onOpenMenu() {
    this.setState({
      isOpen: true
    });
  }

  onRetryClick() {
    this.setState({
      reConnecting: true
    });
    clearTimeout(this.timeOutForTryButton);
    this.timeOutForTryButton = setTimeout(e => {
      const {isDisconnected} = this.socketStatus();
      if (isDisconnected) {
        this.setState({
          reConnecting: false
        });
      }
    }, 5000);
    const {chatRetryHook, chatInstance} = this.props;
    if (chatRetryHook) {
      chatRetryHook().then(token => {
        chatInstance.setToken(token);
        chatInstance.reconnect();
      });
    }
  }

  onChatSearchToggle() {
    const {chatSearchShowing, dispatch} = this.props;
    dispatch(chatSearchShow(!chatSearchShowing));
  }

  socketStatus(defineProps) {
    const {chatState} = defineProps || this.props;
    const isReconnecting = chatState.socketState == 1 && !chatState.deviceRegister;
    const isConnected = chatState.socketState == 1 && chatState.deviceRegister;
    const isDisconnected = chatState.socketState == 3;
    return {isReconnecting, isConnected, isDisconnected, timeUntilReconnect: chatState.timeUntilReconnect};
  }

  render() {
    const {menuItems, chatState, chatInstance, smallVersion, chatSearchShowing, user} = this.props;
    const {isOpen, reConnecting} = this.state;
    const {isReconnecting, isConnected, isDisconnected} = this.socketStatus();
    const iconSize = styleVar.iconSizeLg.replace("px", "");
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    const firstInit = !chatInstance;
    const classNames = classnames({
      [style.AsideHead]: true,
      [style["AsideHead--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} ref={this.container} relative>
        <Notification/>
        <MdMenu size={iconSize}
                className={utilsStlye["u-clickable"]}
                onClick={this.onOpenMenu} style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        <Container centerRight className={style.AsideHead__ConnectionHandlerContainer}>
          <Container inline>
            <Text size="lg" color="gray" light
                  bold>{firstInit || reConnecting ? `${strings.chatState.connectingToChat}${reConnecting ? "" : "..."}` : isConnected ? strings.podchat : isReconnecting ? `${strings.chatState.reconnecting}...` : `${strings.chatState.networkDisconnected}...`}</Text>
          </Container>
          {isDisconnected && !reConnecting &&
          <Container inline onClick={this.onRetryClick}>
            <Text size="xs" color="gray" light linkStyle>{strings.tryAgain}</Text>
          </Container>
          }
          {reConnecting &&
          <Container inline>
            <Loading><LoadingBlinkDots size="sm" invert/></Loading>
          </Container>
          }

        </Container>

        <Dropdown isOpen={isOpen} container={this.container} onClose={this.onCloseMenu}>
          <Container className={style.AsideHead__UserProfileContainer} relative>
            <Gap block x={20} y={20}>
              <Container topLeft>
                <Gap x={10} y={15} block>
                  <MdArrowBack size={style.iconSizeMd} color={styleVar.colorBackgroundLight} style={{margin: "7px 0"}}
                               onClick={this.onCloseMenu}/>
                </Gap>
              </Container>
              <Avatar>
                <AvatarImage src={user.image} text={avatarNameGenerator(user.name).letter}
                             textBg={avatarNameGenerator(user.name).color}
                             customSize="50px"/>
                <Container>
                  <AvatarName>
                    <Container>
                      <Text invert overflow="ellipsis">{user.name}</Text>
                    </Container>
                    <Container>
                      <Text size="xs" invert overflow="ellipsis">{user.cellphoneNumber}</Text>
                    </Container>
                  </AvatarName>
                </Container>
              </Avatar>
              <Text target="_blank" link="https://panel.pod.ir/Users/Info">
                <ButtonFloating onClick={this.onGotoBottomClicked} size="sm" style={{
                  backgroundColor: styleVar.colorAccentLight,
                  boxShadow: "none",
                  left: 5,
                  bottom: 5
                }}>
                  <MdEdit size={style.iconSizeMd} style={{margin: "7px 5px"}}/>
                </ButtonFloating>
              </Text>
            </Gap>
          </Container>
          {menuItems.map(el => (
            <DropdownItem key={el.type} onSelect={this.onMenuSelect.bind(this, el.type)} invert>{el.name}</DropdownItem>
          ))}
        </Dropdown>
        <Container centerLeft>
          <Container className={style.AsideHead__SearchContainer} inline onClick={this.onChatSearchToggle}>
            {chatSearchShowing ?
              <MdClose size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
              :
              <MdSearch size={styleVar.iconSizeMd} color={styleVar.colorWhite}/>
            }
          </Container>
        </Container>
      </Container>
    )
  }
}

export default withRouter(AsideHead);