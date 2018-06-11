// src/list/List.scss.js
import React, {Component} from "react";
import { connect } from "react-redux";
import {getContactList} from '../../actions/GetContactList'
import {List, ListItem} from '../../../ui_kit/components/list'
import {Avatar, AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import {createThread} from "../../actions/CreateThread";

class BoxContactList extends Component {

  constructor() {
    super();
    this.onContactClick.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(getContactList());
  }

  onContactClick(userId){
    this.props.dispatch(createThread(userId));
  }

  render() {
    return (
      <List>
        {this.contacts.map(el => (
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
  return { contacts: state.contacts };
};

const connectedBoxRightNav = connect(mapStateToProps)(BoxContactList);
export default connectedBoxRightNav;