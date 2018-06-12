// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {getContactList} from '../../actions/contactActions'
import {List, ListItem} from '../../../ui_kit/components/list'
import {Avatar, AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import {createThread} from "../../actions/threadActions";
import {addArticle} from "../../actions/messageActions";


@connect(store => {
  return {
    contacts: store.contact.contacts
  };
})
export default class BoxContactList extends Component {

  constructor() {
    super();
    this.onContactClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getContactList());
  }

  onContactClick(userId) {
    this.props.dispatch(createThread('as'));
  }

  render() {
    const {contacts} = this.props;
    return (
      <div>
        {contacts.map(el => (
          <li key={Math.random()} onClick={this.onContactClick.bind(this)}>
            {el.firstName}
          </li>
        ))}
      </div>
    );
  }
};
