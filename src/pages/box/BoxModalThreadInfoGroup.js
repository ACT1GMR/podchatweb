import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadCreate,
  threadRemoveParticipant
} from "../../actions/threadActions";

//UI components
import Button from "raduikit/src/button";
import Gap from "raduikit/src/Gap";
import {Heading, Text} from "raduikit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";
import Divider from "raduikit/src/divider";
import {ContactList} from "./_component/contactList";

//styling
import {MdGroupAdd, MdGroup} from "react-icons/lib/md";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";

@connect()
export default class BoxModalThreadInfo extends Component {

  constructor(props) {
    super(props);
  }

  onStartChat(id) {
    const {onClose, dispatch} = this.props;
    dispatch(threadCreate(id));
    onClose();
  }

  onRemoveParticipant(id) {
    const {thread, dispatch} = this.props;
    dispatch(threadRemoveParticipant(thread.id, [id]));
  }

  render() {
    const {participants, thread, user, onAddingMember} = this.props;
    const isOwner = thread.inviter && user.id === thread.inviter.id;
    const conversationAction = (participant) => {
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
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;
    return (
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
                            onClick={onAddingMember}/>
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
    )
  }
}
