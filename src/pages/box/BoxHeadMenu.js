// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, THREAD_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {threadCreate, threadGetList, threadMessageGetList} from "../../actions/threadActions";
import {contactAdding, contactListShowing} from "../../actions/contactActions";

//UI components
import {Dropdown, DropdownItem} from "raduikit/src/menu";
import {MdMenu, MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxHeadMenu.scss";
import styleVar from "./../../../styles/variables.scss";

const statics = {
  headMenuSize: 60
};

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadId: store.thread.thread.id
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
        type: THREAD_MODAL_CREATE_GROUP_SHOWING
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
    } else if (type === ){
      this.props.dispatch(contactListShowing(true));
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
    const {menuItems} = this.props;
    const {isOpen} = this.state;
    const iconSize = styleVar.iconSizeLg;
    const iconMargin = `${(statics.headMenuSize - iconSize) / 2}px`;
    return (
      <section className={style.BoxHeadMenu} ref={this.container}>
        {isOpen ? (
          <MdClose size={iconSize} onClick={this.onCloseMenu}
                   style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        ) : (
          <MdMenu size={iconSize} onClick={this.onOpenMenu} style={{color: styleVar.colorWhite, margin: iconMargin}}/>
        )}

        <Dropdown isOpen={isOpen} container={this.container} onClose={this.onCloseMenu}>
          {menuItems.map(el => (
            <DropdownItem key={el.type} onSelect={this.onMenuSelect.bind(this, el.type)}>{el.name}</DropdownItem>
          ))}
        </Dropdown>
      </section>
    )
  }
}
