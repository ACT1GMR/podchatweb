// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {getContactListService} from '../../actions/contactActions'
import {List, ListItem} from '../../../ui_kit/components/list'
import {Avatar, AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import {createThreadAction, createThreadSuccess} from "../../actions/createThreadAction";
import {addArticle} from "../../actions/messageActions";

class BoxContactList extends Component {

  constructor() {
    super();
    this.onContactClick.bind(this);
    this.state = {contacts: []}
  }

  componentDidMount() {
    this.props.dispatch(getContactListService());
  }

  onContactClick(userId) {
    this.props.dispatch(createThreadAction(userId));
  }

  render() {
    return (
      <List>
        {[].map(el => (
          <ListItem key={el.id} onClick={this.onContactClick}>
            <Avatar>
              <AvatarImage src={el.avatar}></AvatarImage>
              <AvatarName>{el.firstName} {el.lastName}</AvatarName>
            </Avatar>
          </ListItem>
        ))}
      </List>
    );
  }
}

const mapStateToProps = state => {
  return {contacts: state.contacts};
};

export default connect(mapStateToProps)(BoxContactList);
