import React, {Component, Fragment} from "react";
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
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import List, {ListItem} from "../../../../uikit/src/list";

//styling
import {MdGroupAdd, MdArrowBack, MdSettings, MdBlock, MdNotifications, MdPersonAdd} from "react-icons/md";
import style from "../../../styles/pages/box/ModalThreadInfoGroupMain.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStyle from "../../../styles/utils/utils.scss";


const constants = {
  count: 50,
  ON_ADD_MEMBER: "ON_ADD_MEMBER"
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

export function isOwner(thread, user) {
  return thread.inviter && user.id === thread.inviter.id
}

@connect(store => {
  return {
    threadParticipantAdd: store.threadParticipantAdd.thread,
    notificationPending: store.threadNotification.fetching,
    contacts: store.contactGetList.contacts,
    participants: store.threadParticipantList.participants,
    participantsHasNext: store.threadParticipantList.hasNext,
    participantsNextOffset: store.threadParticipantList.nextOffset,
    participantsFetching: store.threadParticipantList.fetching,
    participantsPartialFetching: store.threadParticipantListPartial.fetching,
  }
}, null, null, {withRef: true})
class ModalThreadInfoGroupMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addMembers: [],
      internalStep: null,
      removingParticipantIds: [],
      partialParticipantLoading: false,
      query: null
    };
    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onAddMember = this.onAddMember.bind(this);
    this.onStartChat = this.onStartChat.bind(this);
    this.onAddMemberSelect = this.onAddMemberSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
    this.onLeaveSelect = this.onLeaveSelect.bind(this);
    this.onNotificationSelect = this.onNotificationSelect.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
  }

  componentDidMount() {
    const {setHeaderFooterComponent, setOnScrollBottomThreshold, thread, user, participantsHasNext, participantsPartialFetching, setScrollBottomThresholdCondition} = this.props;
    const isGroup = thread.group;
    const isChannel = thread.type === 8;
    const FooterFragment = () => {
      return (
        <Fragment>
          {isGroup && isOwner(thread, user) &&
          <Button text onClick={this.onAddMemberSelect}>
            {strings.addMember}
          </Button>
          }
          <Button text onClick={this.onClose}>{strings.close}</Button>
        </Fragment>
      )
    };
    const HeaderFragment = () => {
      return strings.groupInfo(isChannel);
    };
    setHeaderFooterComponent(HeaderFragment, FooterFragment);
    setOnScrollBottomThreshold(this.onScrollBottomThreshold);
    setScrollBottomThresholdCondition(participantsHasNext && !participantsPartialFetching);
  }

  componentDidUpdate(oldProps) {
    const {participantsHasNext, participantsPartialFetching, setScrollBottomThresholdCondition} = this.props;
    setScrollBottomThresholdCondition(participantsHasNext && !participantsPartialFetching);
  }

  onAddMemberSelect() {
    this.setState({
      internalStep: constants.ON_ADD_MEMBER
    });
  }

  onAddMember() {
    const {thread, dispatch, onClose} = this.props;
    const {addMembers, removingParticipantIds} = this.state;
    const removingParticipantIdsClone = [...removingParticipantIds];
    dispatch(threadAddParticipant(thread.id, addMembers));
    onClose();
    this.setState({
      addMembers: [],
      removingParticipantIds: removingParticipantIdsClone,
      internalStep: null
    });
  }

  onSettingsSelect() {
    const {setStep, steps} = this.props;
    setStep(steps.ON_SETTINGS);
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

  onStartChat(participantId, participant) {
    const {user, dispatch} = this.props;
    if (participant.id === user.id) {
      return;
    }
    this.onClose();
    dispatch(threadCreateOnTheFly(participant.coreUserId, participant));
  }

  onClose(dontGoBack) {
    const {onClose, thread, dispatch, setStep, steps} = this.props;
    onClose(dontGoBack);
    if (this.state.query) {
      dispatch(threadParticipantList(thread.id, 0, constants.count));
    }
    setStep(steps.ON_GROUP_INFO);
    this.setState({
      addMembers: [],
      query: null
    });
  }

  onPrevious() {
    const {setStep, steps} = this.props;
    this.setState({
      internalStep: null
    });
    setStep(steps.ON_GROUP_INFO);
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
      participants, thread, user,
      participantsFetching,
      participantsPartialFetching, notificationPending,
      GapFragment, AvatarModalMediaFragment
    } = this.props;
    const {removingParticipantIds, partialParticipantLoading, query, addMembers, internalStep} = this.state;
    if (internalStep === constants.ON_ADD_MEMBER) {
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
    const isThreadOwner = isOwner(thread, user);
    const isChannel = thread.type === 8;
    const iconClasses = `${utilsStyle["u-clickable"]} ${utilsStyle["u-hoverColorAccent"]}`;
    const hasAllowToSeenParticipant = thread.type !== 8 || thread.inviter.id === user.id;
    const conversationAction = ({contact: participant}) => {
      const participantId = participant.id;
      const isCreator = participant.coreUserId === thread.inviter.coreUserId;
      const adminFragment = (
        <Container className={style.ModalThreadInfoGroupMain__AdminTextContainer}>
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


    return (

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
            {isThreadOwner ?
              <Container inline>
                <Container inline>
                  <MdGroupAdd size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                              onClick={this.onAddMemberSelect}/>
                  <Gap x={5}/>
                  <MdSettings size={styleVar.iconSizeMd} color={styleVar.colorGray} className={iconClasses}
                              onClick={this.onSettingsSelect}/>
                  <Gap x={5}/>
                </Container>
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
              isThreadOwner ?
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
        {hasAllowToSeenParticipant && <GapFragment/>}

        {hasAllowToSeenParticipant &&
        <ContactSearchFragment onSearchInputChange={this.onSearchInputChange}
                               onSearchChange={this.onSearchChange} query={query}
                               inputClassName={style.ModalThreadInfoGroupMain__SearchInput}/>
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

    );
  }
}

export default withRouter(ModalThreadInfoGroupMain);