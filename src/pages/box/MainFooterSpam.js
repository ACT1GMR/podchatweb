// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {contactGetList} from "../../actions/contactActions";
import {threadParticipantList, threadSpamPv} from "../../actions/threadActions";
import {chatModalPrompt} from "../../actions/chatActions";

//components
import Container from "../../../../uikit/src/container";
import Text from "../../../../uikit/src/typography/Text";

//styling
import style from "../../../styles/pages/box/MainFooterSpam.scss";


function showSpam(props) {
  const {
    thread,
    user,
    participants,
    participantsFetching,
    contacts,
    contactsFetching
  } = props;
  if (!thread || !thread.inviter) {
    return false;
  }
  if (thread.inviter.id === user.id) {
    return false;
  }
  if (participantsFetching || contactsFetching) {
    return false;
  }
  let participant;
  if (thread.group) {
    return false;
  }
  if (!contacts || !contacts.length) {
    return false
  }
  if (!participants || !participants.length) {
    return false;
  }
  participant = participants.filter(e => e.id !== user.id)[0];
  for (const contact of contacts) {
    if (contact.blockId) {
      continue;
    }
    if (contact.id === participant.contactId) {
      return false;
    }
  }
  return true;
}


function showBlock(props) {
  const {
    thread,
    user,
    participants,
    participantsFetching
  } = props;
  if (participantsFetching) {
    return false;
  }
  let participant;
  if (thread.group) {
    return false;
  }
  if (!participants || !participants.length) {
    return false;
  }
  if (participants[0].threadId !== thread.id) {
    return false;
  }
  participant = participants.filter(e => e.id !== user.id)[0];
  return participant.blocked;
}

@connect(store => {
  return {
    contacts: store.contactGetList.contacts,
    contactsFetching: store.contactGetList.fetching,
    thread: store.thread.thread,
    participants: store.threadParticipantList.participants,
    participantsFetching: store.threadParticipantList.fetching,
    user: store.user.user
  };
}, null, null, {withRef: true})
export default class MainFooterSpam extends Component {

  constructor() {
    super();
    this.reportSpamClick = this.reportSpamClick.bind(this);
  }

  componentDidMount() {
    const {dispatch, thread} = this.props;
    dispatch(contactGetList());
    if (thread) {
      dispatch(threadParticipantList(thread.id));
    }
  }

  componentDidUpdate(oldProps) {
    const {thread, dispatch, contacts} = this.props;
    const {thread: oldThread, contacts: oldContacts} = oldProps;

  }

  reportSpamClick() {
    const {dispatch, thread} = this.props;
    dispatch(chatModalPrompt(true, `${strings.areYouSureToDoIt}؟`, () => {
      dispatch(threadSpamPv(thread.id));
      dispatch(chatModalPrompt());
    }, null, strings.accept))
  }

  render() {
    const showSpamming = showSpam(this.props);
    const showBlockIs = showBlock(this.props);
    let classNamesObject = {
      [style.MainFooterSpam]: true,
      [style["MainFooterSpam--active"]]: showSpamming || showBlockIs
    };
    if (showBlockIs) {
      classNamesObject = {
        ...classNamesObject, ...{
          [style.MainFooterSpam__Blocked]: true
        }
      }
    }
    const classNames = classnames(classNamesObject);
    return (
      showSpamming ?
        <Container className={classNames} userSelect="none">
          <Container centerTextAlign onClick={this.reportSpamClick}>
            <Text linkStyle color="accent" bold>
              {strings.reportSpam}
            </Text>
          </Container>
        </Container>
        :
        <Container className={classNames} userSelect="none">
          <Container className={style.MainFooterSpam__BlockedTextContainer}>
            <Text linkStyle color="accent" bold>
              {strings.unBlock}
            </Text>
          </Container>
        </Container>
    );
  }
}