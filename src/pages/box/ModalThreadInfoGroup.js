import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadAddParticipant,
  threadCreate, threadParticipantList,
  threadRemoveParticipant
} from "../../actions/threadActions";

//UI components
import ModalThreadInfoGroupSettings from "./ModalThreadInfoGroupSettings";
import Button from "raduikit/src/button";
import Gap from "raduikit/src/Gap";
import {Heading, Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Divider from "raduikit/src/divider";
import {ContactList, ContactListSelective} from "./_component/contactList";

//styling
import {MdGroupAdd, MdGroup, MdArrowBack, MdSettings} from "react-icons/lib/md";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import Modal from "raduikit/src/modal";
import ModalHeader from "raduikit/src/modal/ModalHeader";
import ModalBody from "raduikit/src/modal/ModalBody";
import ModalFooter from "raduikit/src/modal/ModalFooter";


const constants = {
  GROUP_INFO: "GROUP_INFO",
  ADD_MEMBER: "ADD_MEMBER",
  ON_SETTINGS: "ON_SETTINGS"
};

@connect(store => {
  return {
    threadParticipantAdd: store.threadParticipantAdd.thread,
    threadParticipantRemove: store.threadParticipantRemove.thread,
  }
})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addMembers: [],
      step: constants.GROUP_INFO
    };
    this.settingsRef = React.createRef();
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
    this.onAddMemberSelect = this.onAddMemberSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onSaveSettings = this.onSaveSettings.bind(this);
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

  onAddMemberSelect() {
    this.setState({
      step: constants.ADD_MEMBER
    });
  }

  onSettingsSelect() {
    this.setState({
      step: constants.ON_SETTINGS
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

  onPrevious() {
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  onStartChat(id) {
    this.props.dispatch(threadCreate(id));
    this.onClose();
  }

  onClose() {
    const {onClose} = this.props;
    onClose();
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  onSaveSettings(){
    this.settingsRef.current.wrappedInstance.saveSettings();
  }

  onRemoveParticipant(id) {
    const {thread, dispatch} = this.props;
    dispatch(threadRemoveParticipant(thread.id, [id]));
  }

  render() {
    const {participants, thread, user, isShow, contacts} = this.props;
    const isOwner = thread.inviter && user.id === thread.inviter.id;
    const {addMembers, step} = this.state;
    const isGroup = thread.group;
    const filteredContacts = contacts.filter(a => a.hasUser && !participants.filter(b => a.id === b.contactId).length);
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;

    const conversationAction = participant => {
      return (
        <Container>

          <Button onClick={this.onStartChat.bind(this, participant.contactId)} text size="sm">
            {strings.startChat}
          </Button>
          {thread.inviter && thread.group && user.id === thread.inviter.id ? (
            <Button onClick={this.onRemoveParticipant.bind(this, participant.id)} text size="sm">
              {strings.remove}
            </Button>
          ) : ""}
        </Container>

      )
    };
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3>{constants.GROUP_INFO === step? strings.groupInfo : constants.ON_SETTINGS === step ? strings.groupSettings : strings.addMember}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.GROUP_INFO ?
            <Container>
              <Container relative>

                <Container>
                  <Avatar>
                    <AvatarImage src={thread.image ? thread.image : defaultAvatar} size="xlg"/>
                    <AvatarName>
                      <Heading h1>{thread.title}</Heading>
                      <Text>{participants.length} {strings.member}</Text>
                    </AvatarName>
                  </Avatar>
                </Container>

                <Container bottomLeft>
                  {isOwner ?
                    <Container inline>
                      <MdGroupAdd size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                                  onClick={this.onAddMemberSelect}/>
                      <Gap x={5}/>
                      <MdSettings size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                                  onClick={this.onSettingsSelect}/>
                      <Gap x={5}/>
                    </Container>
                    : ""}
                  <MdGroup size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                </Container>

              </Container>

              <Gap y={20} block>
                <Divider thick={2} color="gray"/>
              </Gap>


              <Container>
                <ContactList invert selection contacts={participants} actions={conversationAction}/>
              </Container>
            </Container>
            :
            step === constants.ON_SETTINGS ?
              <ModalThreadInfoGroupSettings thread={thread} ref={this.settingsRef}/>
              :
              <Container>
                {contacts.length ?
                  <ContactListSelective invert onSelect={this.onSelect} onDeselect={this.onDeselect}
                                        contacts={filteredContacts}
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
          {step === constants.GROUP_INFO ?
            isGroup && isOwner && filteredContacts.length ?
              <Button text onClick={this.onAddMemberSelect}>
                {strings.addMember}
              </Button>
              : ""
            :
            step === constants.ON_SETTINGS ?
              <Button text onClick={this.onSaveSettings}>
                {strings.saveSettings}
              </Button>
              :
            addMembers.length > 0 ?
              <Button text onClick={this.onAddMember}>
                {strings.add}
              </Button>
              : ""
          }
          <Button text onClick={this.onClose}>{strings.close}</Button>
          {step !== constants.GROUP_INFO ?
            <Button text onClick={this.onPrevious}>
              <MdArrowBack/>
            </Button> : ""
          }
        </ModalFooter>

      </Modal>
    );
  }
}
