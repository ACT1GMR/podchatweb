import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactGetList, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadModalListShowing, threadCreate} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import Message from "raduikit/src/message";
import List, {ListItem} from "raduikit/src/list";
import {InputText} from "raduikit/src/input";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import {MdArrowForward} from "react-icons/lib/md";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";

const constants = {
  GROUP_NAME: "GROUP_NAME",
  SELECT_CONTACT: "SELECT_CONTACT"
};

@connect(store => {
  return {
    isShow: store.contactModalCreateGroupShowing.isShow,
    contacts: store.contactGetList.contacts
  };
})
export default class ModalCreateGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      threadContacts: [],
      groupName:"",
      step: constants.SELECT_CONTACT
    };
    this.onAdd = this.onAdd.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(contactGetList());
  }

  onNext() {
    this.setState({
      step: constants.GROUP_NAME
    });
  }

  onCreate(groupName) {
    this.props.dispatch(threadCreate(this.state.threadContacts, null, groupName));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(contactModalCreateGroupShowing(false));
    this.setState({
      step: constants.SELECT_CONTACT
    })
  }

  onAdd() {

  }

  onSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.push(id);
    this.setState({
      threadContacts: contactsClone
    });
  }

  onDeSelect(id) {
    const {threadContacts} = this.state;
    let contactsClone = [...threadContacts];
    contactsClone.splice(contactsClone.indexOf(id), 1);
    this.setState({
      threadContacts: contactsClone
    });
  }

  groupNameChange(event) {
    this.setState({
      groupName: event.target.value
    })
  }

  render() {
    const {contacts, isShow} = this.props;
    const {threadContacts, step, groupName} = this.state;

    let filteredContacts = contacts.filter(e => e.hasUser);
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3>{strings.selectContacts}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.SELECT_CONTACT ?
            contacts.length ?
              <List>
                {filteredContacts.map(el => (
                  <ListItem key={el.id} invert selection activeWithTick multiple
                            active={threadContacts.indexOf(el.id) > -1}
                            onSelect={this.onSelect.bind(this, el.id)}
                            onDeselect={this.onDeSelect.bind(this, el.id)}>
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
                <Button text onClick={this.onAdd}>{strings.add}</Button>
              </Container>
            :
            <InputText onChange={this.groupNameChange.bind(this)}
                       value={groupName}
                       placeholder={strings.firstName}/>
          }


        </ModalBody>

        <ModalFooter>
          {step === constants.SELECT_CONTACT ?
            threadContacts.length > 1 ?
              <Button text onClick={this.onNext.bind(this)}>
                <MdArrowForward/>
              </Button>
              : ""
            :
            <Button text onClick={this.onCreate.bind(this, groupName)}>{strings.createGroup}</Button>
          }
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
