import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactListShowing, contactAdding, contactGetList, contactChatting} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import List, {ListItem} from "raduikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import {threadCreate, threadShowing} from "../../actions/threadActions";

import defaultAvatar from "../../../styles/images/_common/default-avatar.png"

@connect(store => {
  return {
    isShow: store.contactListShowing.isShow,
    contacts: store.contactGetList.contacts
  };
})
export default class ModalContactList extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.isShow !== this.props.isShow) {
      this.props.dispatch(contactGetList());
    }
  }

  componentDidMount() {
    this.props.dispatch(contactGetList());
  }

  onAdd() {
    this.props.dispatch(contactAdding(true));
  }

  onClose() {
    this.props.dispatch(contactListShowing(false));
  }

  onStartChat(contact) {
    this.props.dispatch(contactChatting(contact));
    this.props.dispatch(threadCreate(contact.id));
    this.onClose();
  }

  render() {
    const {contacts, isShow, smallVersion} = this.props;
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}  inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalHeader>
          <Heading h3>{strings.contactList}</Heading>
        </ModalHeader>

        <ModalBody>
          {contacts.length ?
            <List>
              {contacts.map(el => (
                <ListItem key={el.id} selection invert>
                  <Container relative>
                    <Avatar>
                      <AvatarImage src={el.linkedUser && el.linkedUser.image ? el.linkedUser.image : defaultAvatar}/>
                      <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                    </Avatar>

                    <Container absolute centerLeft>
                      {el.hasUser ? (
                        <Button onClick={this.onStartChat.bind(this, el)} text>
                          {strings.startChat}
                        </Button>
                      ) : (
                        <Button text disabled>{strings.isNotPodUser}</Button>
                      )}
                    </Container>

                  </Container>
                </ListItem>
              ))}
            </List>
            :
            <Container center>
              <Button text onClick={this.onAdd.bind(this)}>{strings.add}</Button>
            </Container>
          }

        </ModalBody>

        <ModalFooter>
          <Button text onClick={this.onAdd.bind(this)}>{strings.add}</Button>
          <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
