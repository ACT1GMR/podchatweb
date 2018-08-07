import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactGetList} from "../../actions/contactActions";
import {threadModalListShowing, threadCreate} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import Message from "raduikit/src/message";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import {threadCreate} from "../../actions/threadActions";
import {threadCreate} from "../../actions/threadActions";

import defaultAvatar from "../../../styles/images/_common/default-avatar.png"

@connect(store => {
  return {
    isShow: store.contactListShowing.isShow,
    contacts: store.contactGetList.contacts
  };
})
export default class BoxModalCreateGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      threadContacts: []
    };
  }

  componentDidMount() {
    this.props.dispatch(contactGetList());
  }

  onCreate() {
    this.props.dispatch(threadCreate(this.state.threadContacts));
  }

  onClose() {
    this.props.dispatch(threadModalListShowing(false));
  }

  onStartChat(contact) {
    this.props.dispatch(threadCreate(contact.id));
    this.onClose();
  }

  onSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.push(id);
    this.setState({
      contacts: contactsClone
    });
  }

  onDeSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.splice(contactsClone.indexOf(id), 1);
    this.setState({
      contacts: contactsClone
    });
  }

  render() {
    const {contacts, isShow} = this.props;
    const {threadContacts} = this.state;

    let filteredContacts = contacts.filter(e => e.hasUser);
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3 invert>{strings.selectContacts}</Heading>
        </ModalHeader>

        <ModalBody>
          {contacts.length ?
            <List>
              {filteredContacts.map(el => (
                <ListItem key={el.id} invert activeWithTick multiple
                          active={~threadContacts.indexOf(el.id)}
                          onSelect={this.onSelect.bind(this, el.id)}
                          onDeSelect={this.onDeSelect.bind(this, el.id)}>
                  <Container>

                    <Avatar>
                      <AvatarImage src={el.image ? el.image : defaultAvatar}/>
                      <AvatarName>{el.firstName} {el.lastName}</AvatarName>
                    </Avatar>

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
          <Button onClick={this.onCreate.bind(this)}>{strings.createGroup}</Button>
          <Button onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
