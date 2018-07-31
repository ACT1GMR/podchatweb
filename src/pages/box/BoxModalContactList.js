import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactListShowing, contactAdding, contactGetList} from "../../actions/contactActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import Button from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import Message from "../../../../uikit/src/message";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";

//styling
import {threadCreate} from "../../actions/threadActions";

import defaultAvatar from "../../../styles/images/_common/default-avatar.png"

@connect(store => {
  return {
    isShow: store.contactListShowing.isShow,
    contacts: store.contactGetList.contacts
  };
})
export default class BoxModalContactList extends Component {

  constructor(props) {
    super(props);
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
    this.props.dispatch(threadCreate(contact.id));
    this.onClose();
  }

  render() {
    const {contacts, isShow} = this.props;
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3 invert>{strings.contactList}</Heading>
        </ModalHeader>

        <ModalBody>
          {contacts.length ?
            <List>
              {contacts.map(el => (
                <ListItem key={el.id} selection invert>
                  <Container relative>
                    <Avatar>
                      <AvatarImage src={el.image ? el.image : defaultAvatar}/>
                      <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                    </Avatar>
                    <Container absolute centerLeft>
                      <Button onClick={this.onStartChat.bind(this, el)} text>
                        {strings.startChat}
                      </Button>
                    </Container>
                  </Container>
                </ListItem>
              ))}
            </List>
            :
            <Container center>
              <Message>{strings.add}</Message>
            </Container>
          }

        </ModalBody>

        <ModalFooter>
          <Button onClick={this.onAdd.bind(this)}>{strings.add}</Button>
          <Button onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
