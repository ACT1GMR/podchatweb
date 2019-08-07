import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {
  contactBlock,
  contactAdding,
  contactRemove,
  contactListShowing, contactSearch
} from "../../actions/contactActions";
import {threadNotification} from "../../actions/threadActions";


//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Divider from "../../../../uikit/src/divider";
import List, {ListItem} from "../../../../uikit/src/list";
import date from "../../utils/date";

//styling
import {MdPerson, MdPhone, MdBlock, MdNotifications, MdEdit, MdDelete} from "react-icons/lib/md";
import styleVar from "./../../../styles/variables.scss";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import {ROUTE_ADD_CONTACT} from "../../constants/routes";
import {chatModalPrompt} from "../../actions/chatActions";

function getParticipant(participants, user) {
  let participant;
  if (participants) {
    participant = participants.filter(e => e.id !== user.id)[0];
  }
  if (!participant) {
    participant = {};
  }
  return participant;
}

@connect(store => {
  return {
    contactBlocking: store.contactBlock.fetching,
    notificationPending: store.threadNotification.fetching,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    contacts: store.contactGetList.contacts
  };
}, null, null, {withRef: true})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contact: {}
    };
  }

  componentDidMount() {
    const {participants, user, dispatch, contacts} = this.props;
    if (!participants || !participants.length) {
      return;
    }
    const participant = getParticipant(participants, user);
    if (!participant.id) {
      return;
    }
    if (!participant.contactId) {
      return;
    }
    if (contacts && contacts.length) {
      let contact = contacts.findIndex(contact => contact.id === participant.contactId);
      if (contact > -1) {
        return this.setState({contact: contacts[contact]});
      }
    }
    dispatch(contactSearch({id: participant.contactId})).then(contact => {
      this.setState({contact})
    });
  }

  componentDidUpdate({participants: oldParticipants}){
    const {participants, user, dispatch, contacts} = this.props;
    if (!participants || !participants.length) {
      return;
    }
    const participant = getParticipant(participants, user);
    const oldParticipant = getParticipant(oldParticipants, user);
    if (!participant.id && !oldParticipant.id) {
      return;
    } else if(participant.id === oldParticipant.id) {
      return;
    }
    if (!participant.contactId) {
      return;
    }
    if (contacts && contacts.length) {
      let contact = contacts.findIndex(contact => contact.id === participant.contactId);
      if (contact > -1) {
        return this.setState({contact: contacts[contact]});
      }
    }
    dispatch(contactSearch({id: participant.contactId})).then(contact => {
      this.setState({contact})
    });
  }

  onBlockSelect(threadId, blocked) {
    const {dispatch, thread} = this.props;
    dispatch(contactBlock(threadId, !blocked, thread));
  }

  onNotificationSelect() {
    const {thread, dispatch} = this.props;
    dispatch(threadNotification(thread.id, !thread.mute));
  }

  onEdit(participant, contact) {
    const {dispatch, history, chatRouterLess, onClose} = this.props;
    dispatch(contactAdding(true, {
      firstName: participant.contactFirstName,
      lastName: participant.contactLastName,
      mobilePhone: contact.cellphoneNumber
    }));
    if (!chatRouterLess) {
      history.push(ROUTE_ADD_CONTACT);
    }
    onClose(true);
  }

  onRemove(participant) {
    const {dispatch} = this.props;
    const text = strings.areYouSureAboutDeletingContact(participant.contactName);
    dispatch(chatModalPrompt(true, `${text}؟`, () => {
      dispatch(contactRemove(participant.contactId, participant.threadId));
      dispatch(chatModalPrompt());
    }, () => dispatch(contactListShowing(true))));
  }

  render() {
    const {participants, thread, user, onClose, isShow, smallVersion, contactBlocking, notificationPending, contacts, GapFragment} = this.props;
    let participant = getParticipant(participants, user);
    const participantImage = participant.image;
    const isMyContact = participant.contactId;
    const contact = this.state.contact || {};
    return (
      <Modal isOpen={isShow} onClose={onClose} inContainer={smallVersion} fullScreen={smallVersion} userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.contactInfo}</Heading>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Container relative>

              <Container>
                <Avatar>
                  <AvatarImage src={participantImage} size="xlg"
                               text={avatarNameGenerator(thread.title).letter}
                               textBg={avatarNameGenerator(thread.title).color}/>
                  <AvatarName>
                    <Heading h1>{thread.title}</Heading>
                    <Text>{strings.prettifyDateString(date.prettifySince(participant ? participant.notSeenDuration : ""))}</Text>
                  </AvatarName>
                </Avatar>
              </Container>

              <Container bottomLeft>
                <MdPerson size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
              </Container>

            </Container>

            <GapFragment/>
            {isMyContact ?
              <List>

                <ListItem invert>
                  {contact.cellphoneNumber &&
                  <Container>
                    <MdPhone size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                    <Gap x={20}>
                      <Text inline>{contact.cellphoneNumber}</Text>
                    </Gap>
                  </Container>
                  }
                </ListItem>

                <ListItem invert>
                  {contact.linkedUser && contact.linkedUser.username &&
                  <Container>
                    <MdPerson size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                    <Gap x={20}>
                      <Text inline>{contact.linkedUser.username}</Text>
                    </Gap>
                  </Container>
                  }
                </ListItem>
              </List> : ""}


            <Container>
              {
                isMyContact &&
                <GapFragment/>
              }
              <List>

                {
                  isMyContact &&
                  <ListItem selection invert onSelect={this.onEdit.bind(this, participant, contact)}>
                    <Container relative>
                      <MdEdit size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                      <Gap x={20}>
                        <Text>{strings.edit}</Text>
                      </Gap>
                    </Container>
                  </ListItem>
                }

                {
                  isMyContact &&
                  <ListItem selection invert onSelect={this.onRemove.bind(this, participant)}>
                    <Container relative>
                      <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                      <Gap x={20}>
                        <Text>{strings.remove}</Text>
                      </Gap>
                    </Container>
                  </ListItem>
                }

                <ListItem selection invert onSelect={this.onBlockSelect.bind(this, thread.id, participant.blocked)}>
                  <Container relative>
                    <MdBlock size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                    <Gap x={20}>
                      <Text>{strings.block}</Text>
                    </Gap>
                    <Container centerLeft>
                      {contactBlocking ?
                        <Container centerTextAlign>
                          <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
                        </Container>
                        :
                        <Gap x={5}>
                          <Text size="sm"
                                color={participant.blocked ? "red" : "green"}>{participant.blocked ? strings.blocked : ""}</Text>
                        </Gap>
                      }
                    </Container>
                  </Container>
                </ListItem>

                <ListItem selection invert onSelect={this.onNotificationSelect.bind(this, thread)}>

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

          </Container>

        </ModalBody>

        <ModalFooter>
          <Button text onClick={onClose}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    );
  }
}
