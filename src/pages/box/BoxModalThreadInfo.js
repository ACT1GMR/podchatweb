import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {contactChatting, contactModalCreateGroupShowing} from "../../actions/contactActions";
import {threadCreate, threadModalThreadInfoShowing, threadParticipantList} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import Gap from "raduikit/src/Gap";
import {Heading, Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Divider from "../../../../uikit/src/divider";
import {ContactList, ContactListSelective} from "./_component/contactList";

//styling
import {MdGroupAdd, MdGroup, MdArrowBack} from "react-icons/lib/md";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";

const constants = {
  GROUP_INFO: "GROUP_INFO",
  ADD_MEMBER: "ADD_MEMBER"
};

@connect(store => {
  return {
    isShow: store.threadModalThreadInfoShowing.isShow,
    participants: store.threadParticipantList.participants,
    thread: store.thread.thread,
    contacts: store.contactGetList.contacts
  };
})
export default class BoxModalThreadInfo extends Component {

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

  componentDidUpdate(oldProps) {
    const {thread, dispatch} = this.props;
    if (thread) {
      if (oldProps.thread !== thread) {
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
    this.setState({
      step: constants.ADD_MEMBER
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

  onStartChat(id) {
    this.props.dispatch(threadCreate(id));
    this.onClose();
  }

  onPrevious(id) {
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  render() {
    const {participants, contacts, isShow, thread} = this.props;
    const {addMembers, step, groupName} = this.state;
    const conversationAction = (contact) => {
      return (<Button onClick={this.onStartChat.bind(this, contact.id)} text>
        {strings.startChat}
      </Button>)
    };
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3 invert>{strings.selectContacts}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.GROUP_INFO ?
            <Container>
              <Container relative>

                <Container>
                  <Avatar>
                    <AvatarImage src={thread.image ? thread.image : defaultAvatar} xlg/>
                    <AvatarName>
                      <Heading h1>{thread.title}</Heading>
                      <Text>{participants.length} {strings.member}</Text>
                    </AvatarName>
                  </Avatar>
                </Container>

                <Container bottomLeft>
                  <MdGroupAdd size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                              onClick={this.onAddingMember}/>
                  <Gap x="5"/>
                  <MdGroup size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                </Container>

              </Container>

              <Gap y="20" block>
                <Divider thick={2} color="gray"/>
              </Gap>

              <Container>
                <ContactList invert selection contacts={participants} actions={conversationAction}/>
              </Container>

            </Container>
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
              <Button onClick={this.onAddMember}>
                {strings.add}
              </Button>
              : ""
            :
            <Button onClick={this.onAddingMember}>
              {strings.addMember}
            </Button>
          }
          <Button onClick={this.onClose}>{strings.cancel}</Button>
          {step === constants.ADD_MEMBER ?
            <Button onClick={this.onPrevious}>
              <MdArrowBack/>
            </Button> : ""
          }
        </ModalFooter>

      </Modal>
    )
  }
}
