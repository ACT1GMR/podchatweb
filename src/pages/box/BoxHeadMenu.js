// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING} from "../../constants/actionTypes";

//actions
import {threadCreate, threadGetList, threadMessageGetList, getThreadInfo} from "../../actions/threadActions";
import {contactAdding} from "../../actions/contactActions";

//UI components
import {Dropdown, DropdownItem, DropdownToggle} from "../../../../uikit/src/menu";
import {MdMenu} from "react-icons/md";

//styling
import style from "../../../styles/pages/box/BoxHeadMenu.scss";

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
        name: strings.pleaseStartAThreadFirst,
        type: CONTACT_ADDING
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  onMenuSelect(type) {
    if (type === CONTACT_ADDING) {
      this.props.dispatch(contactAdding(true));
    }
  }

  onMenuIconClick() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const {menuItems, isOpen} = this.props;
    return (
      <section className={style.BoxHeadMenu}>
        <MdMenu size={24} onClick={this.onMenuIconClick.bind(this)}/>
        {menuItems.map(el => (
          <Dropdown isOpen={isOpen}>
            <DropdownItem onSelect={this.onMenuSelect.bind(this, el.type)}>{el.name}</DropdownItem>
          </Dropdown>
        ))}
      </section>
    )
  }
}
