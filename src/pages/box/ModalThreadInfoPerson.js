import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import Gap from "../../../../uikit/src/Gap";
import {Heading, Text} from "../../../../uikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";
import Divider from "../../../../uikit/src/divider";
import {ContactList, ContactListSelective} from "./_component/contactList";
import date from "../../utils/date";

//styling
import { MdPerson, MdPhone} from "react-icons/lib/md";
import styleVar from "./../../../styles/variables.scss";
import {avatarNameGenerator} from "../../utils/helpers";


@connect(null, null, null, {withRef: true})
export default class ModalThreadInfo extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {participants, thread, user, onClose, isShow, smallVersion} = this.props;
    let participant = participants;
    if (participants) {
      participant = participants.filter(e => e.name !== user.name)[0];
    }
    const participantImage = participant && participant.image;
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
                  <AvatarImage src={participantImage} size="xlg" text={avatarNameGenerator(thread.title).letter} textBg={avatarNameGenerator(thread.title).color}/>
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

            <Container>
              <Container>
                <MdPhone size={styleVar.iconSizeMd} color={styleVar.colorGray}/>
                <Gap x={20}>
                  <Text inline>+98912000000</Text>
                </Gap>
              </Container>
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
