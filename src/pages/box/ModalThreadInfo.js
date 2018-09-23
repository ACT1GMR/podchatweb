import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadCreate,
  threadModalThreadInfoShowing,
  threadParticipantList,
  threadAddParticipant,
  threadRemoveParticipant
} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import Gap from "raduikit/src/Gap";
import {Heading, Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Divider from "raduikit/src/divider";
import {ContactList, ContactListSelective} from "./_component/contactList";
import date from "../../utils/date";
import BoxModalThreadInfoGroup from "./ModalThreadInfoGroup"
import BoxModalThreadInfoPerson from "./ModalThreadInfoPerson"

//styling
import {MdGroupAdd, MdGroup, MdArrowBack, MdPerson} from "react-icons/lib/md";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";

const constants = {
  GROUP_INFO: "GROUP_INFO",
  ADD_MEMBER: "ADD_MEMBER"
};

@connect(store => {
  return {
    user: store.user.user,
    isShow: store.threadModalThreadInfoShowing.isShow,
    participants: store.threadParticipantList.participants,
    thread: store.thread.thread,
    threadParticipantAdd: store.threadParticipantAdd.thread,
    threadParticipantRemove: store.threadParticipantRemove.thread,
    contacts: store.contactGetList.contacts
  };
})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addMembers: [],
      step: constants.GROUP_INFO
    };
    this.onCreate = this.onCreate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
    this.onAddingMember = this.onAddingMember.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
  }

  componentDidMount() {
    const {thread, dispatch} = this.props;
    if (thread.id) {
      dispatch(threadParticipantList(thread.id));
    }
  }

  componentDidUpdate(oldProps) {
    const {thread, threadParticipantAdd, threadParticipantRemove, dispatch} = this.props;
    if (thread.id) {
      if (oldProps.thread.id !== thread.id) {
        dispatch(threadParticipantList(thread.id));
      }
    }

    if (threadParticipantAdd) {
      if (!oldProps.threadParticipantAdd || oldProps.threadParticipantAdd.timestamp !== threadParticipantAdd.timestamp) {
        dispatch(threadParticipantList(thread.id));
      }
    }

    if (threadParticipantRemove) {
      if (!oldProps.threadParticipantRemove || oldProps.threadParticipantRemove.timestamp !== threadParticipantRemove.timestamp) {
        dispatch(threadParticipantList(thread.id));
      }
    }
  }

  onAddingMember() {
    this.setState({
      step: constants.ADD_MEMBER
    });
  }

  onAddMember() {
    const {thread, dispatch} = this.props;
    dispatch(threadAddParticipant(thread.id, this.state.addMembers));
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  onCreate(groupName) {
    this.props.dispatch(threadCreate(this.state.threadContacts, null, groupName));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(threadModalThreadInfoShowing(false));
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    })
  }

  onSelect(id) {
    const {addMembers} = this.state;
    let contactsClone = [...addMembers];
    contactsClone.push(id);
    this.setState({
      addMembers: contactsClone
    });
  }

  onDeselect(id) {
    const {addMembers} = this.state;
    let contactsClone = [...addMembers];
    contactsClone.splice(contactsClone.indexOf(id), 1);
    this.setState({
      addMembers: contactsClone
    });
  }

  onPrevious(id) {
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  render() {
    const {participants, contacts, isShow, thread, user} = this.props;
    const {addMembers, step} = this.state;
    const isGroup = thread.group;
    const isOwner = thread.inviter && user.id === thread.inviter.id;
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3>{step === constants.GROUP_INFO ? isGroup ? strings.groupInfo : strings.contactInfo : strings.addMember}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.GROUP_INFO ?
            isGroup ?
              <BoxModalThreadInfoGroup thread={thread} user={user} participants={participants} onClose={this.onClose.bind(this)} onAddingMember={this.onAddingMember}/>
              :
              <BoxModalThreadInfoPerson thread={thread} user={user} onClose={this.onClose.bind(this)} participants={participants}/>
            :
            <Container>
              {contacts.length ?
                <ContactListSelective invert onSelect={this.onSelect} onDeselect={this.onDeselect} contacts={contacts}
                                      activeList={addMembers}/>
                :
                <Container center>
                  <Button text onClick={this.onAdd}>{strings.add}</Button>
                </Container>
              }
            </Container>
          }

        </ModalBody>

        <ModalFooter>
          {step === constants.ADD_MEMBER ?
            addMembers.length > 0 ?
              <Button text onClick={this.onAddMember}>
                {strings.add}
              </Button>
              : ""
            :
            isGroup && isOwner ?
              <Button text onClick={this.onAddingMember}>
                {strings.addMember}
              </Button>
              : ""

          }
          <Button text onClick={this.onClose}>{strings.close}</Button>
          {step === constants.ADD_MEMBER ?
            <Button text onClick={this.onPrevious}>
              <MdArrowBack/>
            </Button> : ""
          }
        </ModalFooter>

      </Modal>
    )
  }
}
