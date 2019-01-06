import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";


//strings
import strings from "../../constants/localization";

//actions
import {contactGetList, contactBlock} from "../../actions/contactActions";
import {threadNotification} from "../../actions/threadActions";


//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/Gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Divider from "../../../../uikit/src/divider";
import List, {ListItem} from "../../../../uikit/src/list";
import date from "../../utils/date";

//styling
import {MdPerson, MdPhone, MdBlock, MdNotifications} from "react-icons/lib/md";
import styleVar from "./../../../styles/variables.scss";

@connect(store => {
  return {
    contacts: store.contactGetList.contacts,
    chatInstance: store.chatInstance.chatSDK
  };
}, null, null, {withRef: true})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    const {dispatch, chatInstance} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      dispatch(contactGetList());
    }
  }

  onBlockSelect(contact, blocked) {
    const {dispatch, thread} = this.props;
    dispatch(contactBlock(contact.id, !blocked, thread));
  }

  onNotificationSelect() {
    const {thread, dispatch} = this.props;
    dispatch(threadNotification(thread.id, !thread.mute));
  }

  render() {
    const {participants, thread, user, onClose, isShow, smallVersion, contacts} = this.props;
    let participant = participants;
    if (participants) {
      participant = participants.filter(e => e.name !== user.name)[0];
    }
    if (!participant) {
      participant = {};
    }
    const contact = contacts.filter(contact => contact.id === participant.contactId)[0];
    const participantImage = thread && thread.image;
    return (
      <Modal isOpen={isShow} onClose={onClose} inContainer={smallVersion} fullScreen={smallVersion}>

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

            <Gap y={20} block>
              <Divider thick={2} color="gray"/>
            </Gap>
            <List>

              <ListItem invert>
                {contact && contact.cellphoneNumber &&
                <Container>
                  <MdPhone size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                  <Gap x={20}>
                    <Text inline>{contact.cellphoneNumber}</Text>
                  </Gap>
                </Container>
                }
              </ListItem>

              <ListItem invert>
                {contact && contact.linkedUser && contact.linkedUser.name &&
                <Container>
                  <MdPerson size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                  <Gap x={20}>
                    <Text inline>{contact.linkedUser.name}</Text>
                  </Gap>
                </Container>
                }
              </ListItem>
            </List>

            <Container>

              {
                contact &&
                <Container>
                  <Gap y={20} block>
                    <Divider thick={2} color="gray"/>
                  </Gap>
                </Container>
              }
              <List>

                <ListItem selection invert onSelect={this.onBlockSelect.bind(this, contact, participant.blocked)}>
                  <Container relative>
                    <MdBlock size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                    <Gap x={20}>
                      <Text>{strings.block}</Text>
                    </Gap>
                    <Container centerLeft>
                      <Gap x={5}>
                        <Text size="sm"
                              color={participant.blocked ? "red" : "green"}>{participant.blocked ? strings.blocked : ""}</Text>
                      </Gap>
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
                      <Gap x={5}>
                        <Text size="sm"
                              color={thread.mute ? "red" : "green"}>{thread.mute ? strings.inActive : strings.active}</Text>
                      </Gap>
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
