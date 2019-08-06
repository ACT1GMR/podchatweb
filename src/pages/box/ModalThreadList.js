import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {threadModalListShowing} from "../../actions/threadActions";
import {threadCreate} from "../../actions/threadActions";
import {messageEditing} from "../../actions/messageActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Heading} from "../../../../uikit/src/typography";
import Message from "../../../../uikit/src/message";
import List, {ListItem} from "../../../../uikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Container from "../../../../uikit/src/container";

//styling

const constants = {
  forwarding: "FORWARDING"
};

@connect(store => {
  return {
    isShow: store.threadModalListShowing.isShowing,
    message: store.threadModalListShowing.message,
    threads: store.threadList.threads,
    user: store.user.user
  };
}, null, null, {withRef: true})
export default class ModalThreadList extends Component {

  constructor(props) {
    super(props);
  }

  onSend(thread) {
    const {dispatch, message} = this.props;
    dispatch(threadCreate(null, thread));
    dispatch(messageEditing(message, constants.forwarding, thread.id));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(threadModalListShowing(false));
  }

  render() {
    const {threads, isShow, smallVersion, user} = this.props;
    const realThreads = threads.filter(thread => !thread.group || thread.type !== 8 || thread.inviter.id === user.id);
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.forwardTo}</Heading>
        </ModalHeader>

        <ModalBody>
          {realThreads.length ?
            <List>
              {realThreads.map(el => (
                <ListItem key={el.id} selection invert onSelect={this.onSend.bind(this, el)}>
                  <Container relative>

                    <Avatar>
                      <AvatarImage src={el.image} text={avatarNameGenerator(el.title).letter}
                                   textBg={avatarNameGenerator(el.title).color}/>
                      <AvatarName>{el.title}</AvatarName>
                    </Avatar>

                  </Container>
                </ListItem>
              ))}
            </List>
            :
            <Container center>
              <Message warn>
                {strings.thereIsNoChat}
              </Message>
            </Container>
          }

        </ModalBody>

        <ModalFooter>
          <Button text onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
