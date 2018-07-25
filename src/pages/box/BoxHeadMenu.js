// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING} from "../../constants/actionTypes";

//actions
import {threadCreate, threadGetList, threadMessageGetList} from "../../actions/threadActions";
import {contactAdding} from "../../actions/contactActions";

//UI components
import {Dropdown, DropdownItem, DropdownToggle} from "../../../../uikit/src/menu";
import {MdMenu, MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxHeadMenu.scss";
import styleVar from "./../../../styles/variables.scss";

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
        type: "test"
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
    return (
      <section className={style.BoxHeadMenu} ref={this.container}>
        {isOpen ? (
          <MdClose size={32} onClick={this.onCloseMenu}
                   style={{color: styleVar.colorWhite, margin: "14px"}}/>
        ) : (
          <MdMenu size={32} onClick={this.onOpenMenu} style={{color: styleVar.colorWhite, margin: "14px"}}/>
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
