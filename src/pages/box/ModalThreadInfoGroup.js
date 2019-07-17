import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {avatarNameGenerator} from "../../utils/helpers";

//actions
import {
  threadAddParticipant,
  threadCreate, threadLeave, threadModalThreadInfoShowing, threadNotification, threadParticipantList,
  threadRemoveParticipant
} from "../../actions/threadActions";

//UI components
import {ContactList, ContactListSelective} from "./_component/contactList";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import ModalThreadInfoGroupSettings from "./ModalThreadInfoGroupSettings";
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Divider from "../../../../uikit/src/divider";
import Modal from "../../../../uikit/src/modal";
import ModalHeader from "../../../../uikit/src/modal/ModalHeader";
import ModalBody from "../../../../uikit/src/modal/ModalBody";
import ModalFooter from "../../../../uikit/src/modal/ModalFooter";
import List, {ListItem} from "../../../../uikit/src/list";
import {chatModalPrompt} from "../../actions/chatActions";

//styling
import {MdGroupAdd, MdArrowBack, MdSettings, MdBlock, MdNotifications, MdPersonAdd} from "react-icons/lib/md";
import style from "./../../../styles/pages/box/ModalThreadInfoGroup.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStyle from "../../../styles/utils/utils.scss";


const constants = {
  GROUP_INFO: "GROUP_INFO",
  ADD_MEMBER: "ADD_MEMBER",
  ON_SETTINGS: "ON_SETTINGS"
};

@connect(store => {
  return {
    threadParticipantAdd: store.threadParticipantAdd.thread,
    notificationPending: store.threadNotification.fetching,
    contacts: store.contactGetList.contacts
  }
}, null, null, {withRef: true})
class ModalThreadInfoGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addMembers: [],
      step: constants.GROUP_INFO,
      removingParticipantIds: [],
      partialParticipantLoading: false
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
    this.onLeaveSelect = this.onLeaveSelect.bind(this);
    this.onNotificationSelect = this.onNotificationSelect.bind(this);
  }

  componentDidUpdate(oldProps) {
    const {thread, threadParticipantAdd, dispatch} = this.props;
    if (thread.id) {
      if (oldProps.thread.id !== thread.id) {
        this.setState({
          partialParticipantLoading: false
        });
        dispatch(threadParticipantList(thread.id));
      }
    }

    if (threadParticipantAdd) {
      if (!oldProps.threadParticipantAdd || oldProps.threadParticipantAdd.timestamp !== threadParticipantAdd.timestamp) {
        this.setState({
          partialParticipantLoading: true
        });
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
    const {addMembers, removingParticipantIds} = this.state;
    const removingParticipantIdsClone = [...removingParticipantIds];
    dispatch(threadAddParticipant(thread.id, addMembers));
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: [],
      removingParticipantIds: removingParticipantIdsClone
    });
  }

  onSelect(id, contact) {
    const {addMembers, removingParticipantIds} = this.state;
    let contactsClone = [...addMembers];
    contactsClone.push(id);
    const removingParticipantIdsClone = [...removingParticipantIds];
    const index = removingParticipantIdsClone.indexOf(contact.userId);
    if(index > -1 ) {
      removingParticipantIdsClone.splice(index, 1);
    }
    this.setState({
      addMembers: contactsClone,
      removingParticipantIds: removingParticipantIdsClone
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

  onStartChat(id, isParticipant) {
    this.onClose();
    this.props.dispatch(threadCreate(id, null, null, isParticipant ? "TO_BE_USER_ID" : null));
  }

  onClose(dontGoBack) {
    const {onClose} = this.props;
    onClose(dontGoBack);
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  onLeaveSelect() {
    const {dispatch, thread} = this.props;
    dispatch(chatModalPrompt(true, `${strings.areYouSureAboutLeavingGroup(thread.title, thread.type === 8)}؟`, () => {
      dispatch(threadLeave(thread.id));
      dispatch(threadModalThreadInfoShowing());
      dispatch(chatModalPrompt());
    }, null, strings.leave));
  }

  onNotificationSelect() {
    const {thread, dispatch} = this.props;
    dispatch(threadNotification(thread.id, !thread.mute));
  }

  onSaveSettings() {
    this.settingsRef.current.wrappedInstance.saveSettings();
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: []
    });
  }

  onRemoveParticipant(participant) {
    const {thread, dispatch} = this.props;
    const {removingParticipantIds} = this.state;
    dispatch(chatModalPrompt(true, `${strings.areYouSureAboutRemovingMember(participant.name, thread.type === 8)}؟`, () => {
      dispatch(threadRemoveParticipant(thread.id, [participant.id]));
      dispatch(chatModalPrompt());
      this.setState({
        removingParticipantIds: [...removingParticipantIds, ...[participant.id]]
      });
    }, null));
  }

  render() {
    const {participants, thread, user, isShow, contacts, smallVersion, participantsFetching, notificationPending, GapFragment} = this.props;
    const {removingParticipantIds, partialParticipantLoading} = this.state;
    const isOwner = thread.inviter && user.id === thread.inviter.id;
    const isChannel = thread.type === 8;
    const {addMembers, step} = this.state;
    const isGroup = thread.group;
    const filteredContacts = contacts.filter(a => a.hasUser && !participants.filter(b => a.id === b.contactId).length);
    const iconClasses = `${utilsStyle["u-clickable"]} ${utilsStyle["u-hoverColorAccent"]}`;

    const conversationAction = participant => {
      const participantId = participant.id;
      const isCreator = participant.coreUserId === thread.inviter.coreUserId;
      const adminFragment = (
        <Container className={style.ModalThreadInfoGroup__AdminTextContainer}>
          <Text size="sm" color="accent">{strings.admin}</Text>
        </Container>
      );
      if(user.id === participantId) {
        if(isCreator) {
          return adminFragment;
        }
        return "";
      }
      const participantContactId = participant.contactId;
      const isRemovingParticipant = removingParticipantIds.indexOf(participantId) > -1;
      const id = participantContactId || participantId;
      const isParticipant = !participantContactId;
      return (
        <Container>
          {isRemovingParticipant ?
            <Container centerTextAlign>
              <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
            </Container>
            :
            <Container>
              <Button onClick={this.onStartChat.bind(this, id, isParticipant)} text size="sm">
                {strings.startChat}
              </Button>
              {isCreator && adminFragment}
              {thread.inviter && thread.group && user.id === thread.inviter.id ? (
                <Button onClick={this.onRemoveParticipant.bind(this, participant)} text size="sm">
                  {strings.remove}
                </Button>
              ) : ""}
            </Container>
          }

        </Container>

      )
    };
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading
            h3>{constants.GROUP_INFO === step ? strings.groupInfo(isChannel) : constants.ON_SETTINGS === step ? strings.groupSettings(isChannel) : strings.addMember}</Heading>
        </ModalHeader>

        <ModalBody>
          {step === constants.GROUP_INFO ?
            <Container>
              <Container relative>

                <Container>
                  <Avatar>
                    <AvatarImage src={thread.image} size="xlg" text={avatarNameGenerator(thread.title).letter}
                                 textBg={avatarNameGenerator(thread.title).color}/>
                    <AvatarName>
                      <Heading h1>{thread.title}</Heading>
                      <Text>{thread.participantCount} {strings.member}</Text>
                    </AvatarName>
                  </Avatar>
                </Container>

                <Container bottomLeft>
                  {isOwner ?
                    <Container inline>
                      {filteredContacts.length ?
                        <Container inline>
                          <MdGroupAdd size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                                      onClick={this.onAddMemberSelect}/>
                          <Gap x={5}/>
                        </Container> : ""
                      }
                      <MdSettings size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                                  onClick={this.onSettingsSelect}/>
                      <Gap x={5}/>
                    </Container>
                    : ""}
                </Container>

              </Container>

              {thread.description &&
              <Container>
                <GapFragment/>
                <Text color="accent" size="sm">{strings.description} :</Text>
                <Text>{thread.description}</Text>
              </Container>
              }

              <GapFragment/>

              <Container>
                <List>
                  {
                    isOwner && filteredContacts.length ?
                      <ListItem selection invert onSelect={this.onAddMemberSelect}>
                        <Container relative>
                          <MdPersonAdd size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                          <Gap x={20}>
                            <Text>{strings.addMember}</Text>
                          </Gap>
                        </Container>
                      </ListItem> : ""
                  }
                  <ListItem selection invert onSelect={this.onLeaveSelect}>
                    <Container relative>
                      <MdBlock size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                      <Gap x={20}>
                        <Text>{strings.leaveGroup(isChannel)}</Text>
                      </Gap>
                    </Container>
                  </ListItem>

                  <ListItem selection invert onSelect={this.onNotificationSelect}>

                    <Container relative>
                      <MdNotifications size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                      <Gap x={20}>
                        <Text>{strings.notification}</Text>
                      </Gap>
                      <Container centerLeft>
                        {notificationPending ?
                          <Container centerTextAlign>
                            <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
                          </Container>
                          :
                          <Gap x={5}>
                            <Text size="sm"
                                  color={thread.mute ? "red" : "green"}>{thread.mute ? strings.inActive : strings.active}</Text>
                          </Gap>
                        }
                      </Container>
                    </Container>
                  </ListItem>
                </List>
              </Container>

              <GapFragment/>

              <Container>
                {participantsFetching && !partialParticipantLoading ?
                  <Container centerTextAlign>
                    <Loading hasSpace><LoadingBlinkDots/></Loading>
                    <Text>{strings.waitingForContact}...</Text>
                  </Container>
                  :
                  <ContactList invert selection contacts={participants} actions={conversationAction}/>
                }
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

export default withRouter(ModalThreadInfoGroup);
