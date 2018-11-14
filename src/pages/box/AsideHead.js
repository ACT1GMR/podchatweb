// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";

//UI components
import Notification from "./Notification";
import {Dropdown, DropdownItem} from "raduikit/src/menu";
import {Text} from "raduikit/src/typography";
import {MdMenu, MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/AsidHead.scss";
import styleVar from "./../../../styles/variables.scss";
import Container from "raduikit/src/container";
import utilsStlye from "../../../styles/utils/utils.scss";

const statics = {
  headMenuSize: 59
};

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadId: store.thread.thread.id,
    chatState: store.chatState,
    chatInstance: store.chatInstance.chatSDK
  };
})
export default class AsideHead extends Component {

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
  }

  onMenuSelect(type) {
    if (type === CONTACT_ADDING) {
      this.props.dispatch(contactAdding(true));
    } else if (type === CONTACT_LIST_SHOWING) {
      this.props.dispatch(contactListShowing(true));
    } else if (type === CONTACT_MODAL_CREATE_GROUP_SHOWING) {
      this.props.dispatch(contactModalCreateGroupShowing(true));
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

  onRetryClick(){
    this.props.chatInstance.chatAgent.reconnect();
  }

  render() {
    const {menuItems, chatState} = this.props;
    const {isOpen} = this.state;
    const iconSize = styleVar.iconSizeLg.replace("px", "");
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    const isReconnecting = chatState.socketState == 1 && !chatState.deviceRegister;
    const isConnected = chatState.socketState == 1 && chatState.deviceRegister ;
    const isDisconnected = chatState.socketState == 3 ;
    return (
      <Container className={style.AsideHead} ref={this.container} relative>
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
            <Text size="lg" color="gray" light bold>{isConnected ? strings.podchat : isReconnecting ?  `${strings.chatState.reconnecting}...` : `${strings.chatState.networkDisconnected}...`}</Text>
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
      </Container>
    )
  }
}
