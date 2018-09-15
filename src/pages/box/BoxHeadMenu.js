// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {threadCreate, threadGetList, threadMessageGetList} from "../../actions/threadActions";
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";

//UI components
import {Dropdown, DropdownItem} from "raduikit/src/menu";
import {MdMenu, MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxHeadMenu.scss";
import styleVar from "./../../../styles/variables.scss";
import classnames from "classnames";

const statics = {
  headMenuSize: 60
};

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadId: store.thread.thread.id,
    threadShowing: store.threadShowing
  };
})
export default class BoxHeadMenu extends Component {

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
  }

  onMenuSelect(type) {
    if (type === CONTACT_ADDING) {
      this.props.dispatch(contactAdding(true));
    } else if (type ===  CONTACT_LIST_SHOWING){
      this.props.dispatch(contactListShowing(true));
    } else if( type === CONTACT_MODAL_CREATE_GROUP_SHOWING) {
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

  render() {
    const {menuItems, threadShowing} = this.props;
    const {isOpen} = this.state;
    const iconSize = styleVar.iconSizeLg.replace("px", "");
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    const classNames = classnames({
      [style.BoxHeadMenu]: true,
      [style["BoxHeadMenu--isThreadShow"]]: threadShowing
    });
    return (
      <section className={classNames} ref={this.container}>
        {isOpen ? (
          <MdClose size={iconSize} onClick={this.onCloseMenu}
                   style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        ) : (
          <MdMenu size={iconSize} onClick={this.onOpenMenu} style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        )}

        <Dropdown isOpen={isOpen} container={this.container} onClose={this.onCloseMenu} >
          {menuItems.map(el => (
            <DropdownItem key={el.type} onSelect={this.onMenuSelect.bind(this, el.type)} invert>{el.name}</DropdownItem>
          ))}
        </Dropdown>
      </section>
    )
  }
}
