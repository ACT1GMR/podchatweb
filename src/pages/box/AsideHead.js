// src/list/Avatar.scss
import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {signOut, retry} from "podauth";

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
import {MdMenu, MdClose, MdSearch} from "react-icons/lib/md";
import Notification from "./Notification";
import {Dropdown, DropdownItem} from "../../../../uikit/src/menu";
import {Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";

//styling
import style from "../../../styles/pages/box/AsidHead.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import classnames from "classnames";
import {chatSearchShow} from "../../actions/chatActions";

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
    threads: store.threadList.threads,
    threadId: store.thread.thread.id,
    chatState: store.chatState,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    chatSearchShowing: store.chatSearchShow,
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
        name: strings.createGroup,
        type: CONTACT_MODAL_CREATE_GROUP_SHOWING
      },
      {
        name: strings.createChannel,
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
      isOpen: false
    };
    this.container = React.createRef();
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.onRetryClick = this.onRetryClick.bind(this);
    this.onChatSearchToggle = this.onChatSearchToggle.bind(this);
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
      default:
        signOut();
    }
  }

  onCloseMenu() {
    this.setState({
      isOpen: false
    })
  }

  onOpenMenu() {
    this.setState({
      isOpen: true
    })
  }

  onRetryClick() {
    retry(true, true).then(e => {
      const {chatInstance} = this.props;
      chatInstance.setToken(e.access_token);
      chatInstance.reconnect();
    });
  }

  onChatSearchToggle() {
    const {chatSearchShowing} = this.props;
    this.props.dispatch(chatSearchShow(!chatSearchShowing));
  }

  render() {
    const {menuItems, chatState, chatInstance, smallVersion, chatSearchShowing} = this.props;
    const {isOpen} = this.state;
    const iconSize = styleVar.iconSizeLg.replace("px", "");
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    const firstInit = !chatInstance;
    const isReconnecting = chatState.socketState == 1 && !chatState.deviceRegister;
    const isConnected = chatState.socketState == 1 && chatState.deviceRegister;
    const isDisconnected = chatState.socketState == 3;
    const classNames = classnames({
      [style.AsideHead]: true,
      [style["AsideHead--smallVersion"]]: smallVersion
    });
    return (
      <Container className={classNames} ref={this.container} relative>
        <Notification/>
        {isOpen ? (
          <MdClose size={iconSize} onClick={this.onCloseMenu}
                   className={utilsStlye["u-clickable"]}
                   style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        ) : (
          <MdMenu size={iconSize}
                  className={utilsStlye["u-clickable"]}
                  onClick={this.onOpenMenu} style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        )}
        <Container centerRight className={style.AsideHead__ConnectionHandlerContainer}>
          <Container inline>
            <Text size="lg" color="gray" light
                  bold>{firstInit ? `${strings.chatState.connectingToChat}...` : isConnected ? strings.podchat : isReconnecting ? `${strings.chatState.reconnecting}...` : `${strings.chatState.networkDisconnected}...`}</Text>
          </Container>
          {isDisconnected &&
          <Container inline onClick={this.onRetryClick}>
            <Text size="xs" color="gray" light linkStyle>{strings.tryAgain}</Text>
          </Container>
          }

        </Container>

        <Dropdown isOpen={isOpen} container={this.container} onClose={this.onCloseMenu}>
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