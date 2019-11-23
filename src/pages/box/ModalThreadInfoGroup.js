import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getName} from "./_component/contactList";
import ModalContactList, {statics as modalContactListStatics} from "./ModalContactList";

//strings
import strings from "../../constants/localization";
import {avatarNameGenerator} from "../../utils/helpers";

//actions
import {
  threadAddParticipant,
  threadCreate,
  threadCreateOnTheFly,
  threadLeave,
  threadModalThreadInfoShowing,
  threadNotification,
  threadParticipantList,
  threadRemoveParticipant
} from "../../actions/threadActions";
import {chatModalPrompt} from "../../actions/chatActions";

//UI components
import {ContactList} from "./_component/contactList";
import {ContactSearchFragment, PartialLoadingFragment} from "./ModalContactList";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import ModalThreadInfoGroupSettings from "./ModalThreadInfoGroupSettings";
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Modal from "../../../../uikit/src/modal";
import ModalHeader from "../../../../uikit/src/modal/ModalHeader";
import ModalBody from "../../../../uikit/src/modal/ModalBody";
import ModalFooter from "../../../../uikit/src/modal/ModalFooter";
import List, {ListItem} from "../../../../uikit/src/list";

//styling
import {MdGroupAdd, MdArrowBack, MdSettings, MdBlock, MdNotifications, MdPersonAdd} from "react-icons/lib/md";
import style from "./../../../styles/pages/box/ModalThreadInfoGroup.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStyle from "../../../styles/utils/utils.scss";


const constants = {
  GROUP_INFO: "GROUP_INFO",
  ADD_MEMBER: "ADD_MEMBER",
  ON_SETTINGS: "ON_SETTINGS",
  count: 50
};

function ModalContactListFooterFragment(addMembers, onPrevious, onClose) {
  return (
    <Container>
      {
        addMembers.length > 0 &&
        <Button text onClick={this.onAddMember}>
          {strings.add}
        </Button>
      }
      <Button text onClick={onClose}>{strings.close}</Button>
      <Button text onClick={onPrevious}>
        <MdArrowBack/>
      </Button>
    </Container>
  )
}

@connect(store => {
  return {
    threadParticipantAdd: store.threadParticipantAdd.thread,
    notificationPending: store.threadNotification.fetching,
    contacts: store.contactGetList.contacts,
    participantsFetching: store.threadParticipantList.fetching,
    participantsPartialFetching: store.threadParticipantListPartial.fetching,
    participantsHasNext: store.threadParticipantList.hasNext,
    participantsNextOffset: store.threadParticipantList.nextOffset
  }
}, null, null, {withRef: true})
class ModalThreadInfoGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addMembers: [],
      step: constants.GROUP_INFO,
      removingParticipantIds: [],
      partialParticipantLoading: false,
      query: null
    };
    this.settingsRef = React.createRef();
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
    this.onStartChat = this.onStartChat.bind(this);
    this.onAddMemberSelect = this.onAddMemberSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onSaveSettings = this.onSaveSettings.bind(this);
    this.onLeaveSelect = this.onLeaveSelect.bind(this);
    this.onNotificationSelect = this.onNotificationSelect.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidUpdate(oldProps) {
    const {thread, threadParticipantAdd, dispatch} = this.props;
    if (thread.id) {
      if (oldProps.thread.id !== thread.id) {
        dispatch(threadParticipantList(thread.id, 0, constants.count));
      }
    }

    if (threadParticipantAdd) {
      if (!oldProps.threadParticipantAdd || oldProps.threadParticipantAdd.timestamp !== threadParticipantAdd.timestamp) {
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
    this.onClose(true);
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
    if (index > -1) {
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

  onStartChat(participantId, participant) {
    const {user, dispatch} = this.props;
    if (participant.id === user.id) {
      return;
    }
    this.onClose();
    dispatch(threadCreateOnTheFly(participant.coreUserId, participant));
  }

  onClose(dontGoBack) {
    const {onClose, thread, dispatch} = this.props;
    onClose(dontGoBack);
    if (this.state.query) {
      dispatch(threadParticipantList(thread.id, 0, constants.count));
    }
    this.setState({
      step: constants.GROUP_INFO,
      addMembers: [],
      query: null
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

  onRemoveParticipant(participant, e) {
    if (e) {
      e.stopPropagation();
    }
    const {thread, dispatch} = this.props;
    const {removingParticipantIds} = this.state;
    dispatch(chatModalPrompt(true, `${strings.areYouSureAboutRemovingMember(getName(participant), thread.type === 8)}؟`, () => {
      dispatch(threadRemoveParticipant(thread.id, [participant.id]));
      dispatch(chatModalPrompt());
      this.setState({
        removingParticipantIds: [...removingParticipantIds, ...[participant.id]]
      });
    }, null));
  }

  onSearchInputChange(query) {
    this.setState({query});
  }

  onSearchChange(query) {
    const {dispatch, thread} = this.props;
    dispatch(threadParticipantList(thread.id, 0, constants.count, query));
  }

  onScrollBottomThreshold() {
    const {participantsNextOffset, dispatch, thread} = this.props;
    const {query} = this.state;
    dispatch(threadParticipantList(thread.id, participantsNextOffset, constants.count, query));
  }

  render() {
    const {
      participants, thread, user, isShow, smallVersion,
      participantsFetching, participantsHasNext, participantsPartialFetching, notificationPending,
      GapFragment, AvatarModalMediaFragment
    } = this.props;
    const {removingParticipantIds, partialParticipantLoading, query} = this.state;
    const isOwner = thread.inviter && user.id === thread.inviter.id;
    const isChannel = thread.type === 8;
    const {addMembers, step} = this.state;
    const isGroup = thread.group;
    const iconClasses = `${utilsStyle["u-clickable"]} ${utilsStyle["u-hoverColorAccent"]}`;
    const hasAllowToSeenParticipant = thread.type !== 8 || thread.inviter.id === user.id;
    const conversationAction = ({contact: participant}) => {
      const participantId = participant.id;
      const isCreator = participant.coreUserId === thread.inviter.coreUserId;
      const adminFragment = (
        <Container className={style.ModalThreadInfoGroup__AdminTextContainer}>
          <Text size="sm" color="accent">{strings.admin}</Text>
        </Container>
      );
      if (user.id === participantId) {
        if (isCreator) {
          return adminFragment;
        }
        return "";
      }
      const isRemovingParticipant = removingParticipantIds.indexOf(participantId) > -1;
      return (
        <Container onMouseDown={e => e.stopPropagation()}>
          {isRemovingParticipant ?
            <Container centerTextAlign>
              <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
            </Container>
            :
            <Container>
              {thread.inviter && thread.group && user.id === thread.inviter.id ? (
                <Button onClick={this.onRemoveParticipant.bind(this, participant)} text size="sm">
                  {strings.remove}
                </Button>
              ) : ""}
              {isCreator && adminFragment}
            </Container>
          }

        </Container>

      )
    };

    if (step === constants.ADD_MEMBER) {
      return <ModalContactList isShow
                               selectiveMode
                               headingTitle={strings.selectContacts}
                               activeList={addMembers}
                               FooterFragment={ModalContactListFooterFragment.bind(this, addMembers, this.onPrevious, this.onClose)}
                               userType={modalContactListStatics.userType.HAS_POD_USER_NOT_BLOCKED}
                               onClose={this.onClose}
                               onSelect={this.onSelect}
                               onDeselect={this.onDeselect}/>
    }
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading
            h3>{constants.GROUP_INFO === step ? strings.groupInfo(isChannel) : constants.ON_SETTINGS === step ? strings.groupSettings(isChannel) : strings.addMember}</Heading>
        </ModalHeader>

        <ModalBody threshold={5}
                   onScrollBottomThresholdCondition={participantsHasNext && !participantsPartialFetching}
                   onScrollBottomThreshold={this.onScrollBottomThreshold}>
          {step === constants.GROUP_INFO ?
            <Container>
              <Container relative>

                <Container>
                  <Avatar>
                    <AvatarImage src={thread.image} size="xlg" text={avatarNameGenerator(thread.title).letter}
                                 textBg={avatarNameGenerator(thread.title).color}>
                      <AvatarModalMediaFragment thread={thread}/>
                    </AvatarImage>
                    <AvatarName>
                      <Heading h1>{thread.title}</Heading>
                      <Text>{thread.participantCount} {strings.member}</Text>
                    </AvatarName>
                  </Avatar>
                </Container>

                <Container bottomLeft>
                  {isOwner ?
                    <Container inline>
                      <Container inline>
                        <MdGroupAdd size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                                    onClick={this.onAddMemberSelect}/>
                        <Gap x={5}/>
                      </Container>
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
                    isOwner ?
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
              {hasAllowToSeenParticipant && <GapFragment/> }

              {hasAllowToSeenParticipant &&
              <ContactSearchFragment onSearchInputChange={this.onSearchInputChange}
                                     onSearchChange={this.onSearchChange} query={query}
                                     inputClassName={style.ModalThreadInfoGroup__SearchInput}/>
              }
              {hasAllowToSeenParticipant &&
              <Container>
                {participantsFetching && !partialParticipantLoading ?
                  <Container centerTextAlign>
                    <Loading hasSpace><LoadingBlinkDots/></Loading>
                    <Text>{strings.waitingForContact}...</Text>
                  </Container>
                  :
                  participants.length ?
                    <Container relative>
                      <ContactList invert
                                   selection
                                   onSelect={this.onStartChat}
                                   contacts={participants} LeftActionFragment={conversationAction}/>
                      {participantsPartialFetching && <PartialLoadingFragment/>}
                    </Container> :
                    query && query.trim() &&
                    <Container relative centerTextAlign>
                      <Gap y={5}>
                        <Container>
                          <Text>{strings.thereIsNoContactWithThisKeyword(query)}</Text>
                        </Container>
                      </Gap>
                    </Container>
                }
              </Container>
              }
            </Container>
            : <ModalThreadInfoGroupSettings thread={thread} ref={this.settingsRef}/>
          }
        </ModalBody>

        <ModalFooter>
          {step === constants.GROUP_INFO ?
            isGroup && isOwner ?
              <Button text onClick={this.onAddMemberSelect}>
                {strings.addMember}
              </Button>
              : ""
            :
            step === constants.ON_SETTINGS ?
              <Button text onClick={this.onSaveSettings}>
                {strings.saveSettings}
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
