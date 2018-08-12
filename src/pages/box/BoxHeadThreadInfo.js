// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";
import {CONTACT_ADDING, CONTACT_LIST_SHOWING, CONTACT_MODAL_CREATE_GROUP_SHOWING} from "../../constants/actionTypes";

//actions
import {threadModalCreateGroupShowing} from "../../actions/threadActions";
import {contactAdding, contactListShowing, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadModalThreadInfoShowing} from "../../actions/threadActions";


//UI components
import {Dropdown, DropdownItem} from "raduikit/src/menu";
import Button from "raduikit/src/button";
import {MdMenu, MdClose} from "react-icons/lib/md";
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Gap from "raduikit/src/Gap";
import {Heading, Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Divider from "../../../../uikit/src/divider";

//styling
import style from "../../../styles/pages/box/BoxHeadThreadInfo.scss";
import styleVar from "./../../../styles/variables.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";

const statics = {
};

@connect(store => {
  return {
    thread: store.thread.thread
  };
})
export default class BoxHeadThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.onShowInfoClick = this.onShowInfoClick.bind(this);
  }

  onShowInfoClick() {
    this.props.dispatch(threadModalThreadInfoShowing(true));
  }

  render() {
    const {thread} = this.props;
    if(thread.id) {
      return (
        <section className={style.BoxHeadThreadInfo} ref={this.container}>
          <Container>
            <Avatar>
              <AvatarImage src={thread.image ? thread.image : defaultAvatar}/>
              <AvatarName>
                <Text>{thread.title}</Text>
                <Text>{thread.participantCount} {strings.member}</Text>
              </AvatarName>
            </Avatar>
          </Container>

        </section>
      )
    }
    return ""
  }
}
