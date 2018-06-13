// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {getContactList} from '../../actions/contactActions'
import {createThread} from "../../actions/threadActions";
import {addArticle} from "../../actions/messageActions";

//UI components
import {Avatar, AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import {List, ListItem} from '../../../ui_kit/components/list'


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

  onContactClick(contactId) {
    this.props.dispatch(createThread(contactId));
  }

  render() {
    const {contacts} = this.props;
    return (
      <List>
        {contacts.map(el => (
          <ListItem key={el.id} onClick={this.onContactClick.bind(this, el.id)}>
            <Avatar>
              <AvatarImage></AvatarImage>
              <AvatarName>{el.firstName} {el.lastName}</AvatarName>
            </Avatar>
          </ListItem>
        ))}
      </List>
    );
  }
};