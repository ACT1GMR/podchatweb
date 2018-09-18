import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadModalListShowing} from "../../actions/threadActions";
import {threadCreate} from "../../actions/threadActions";
import {messageEditing} from "../../actions/messageActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../../uikit/src/modal";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import Message from "raduikit/src/message";
import List, {ListItem} from "raduikit/src/list";
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Container from "raduikit/src/container";

//styling
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";

const constants = {
  forwarding: "FORWARDING"
};

@connect(store => {
  return {
    isShow: store.threadModalListShowing.isShowing,
    message: store.threadModalListShowing.message,
    threads: store.threadList.threads
  };
})
export default class ModalContactList extends Component {

  constructor(props) {
    super(props);
  }

  onSend(thread) {
    const {dispatch, message} = this.props;
    dispatch(threadCreate(null, thread));
    dispatch(messageEditing(message, constants.forwarding));
    this.onClose();
  }

  onClose() {
    this.props.dispatch(threadModalListShowing(false));
  }

  render() {
    const {threads, isShow} = this.props;
    return (
      <Modal isOpen={isShow} onClose={this.onClose.bind(this)}>

        <ModalHeader>
          <Heading h3>{strings.forwardTo}</Heading>
        </ModalHeader>

        <ModalBody>
          {threads.length ?
            <List>
              {threads.map(el => (
                <ListItem key={el.id} selection invert onSelect={this.onSend.bind(this, el)}>
                  <Container relative>

                    <Avatar>
                      <AvatarImage src={el.image ? el.image : defaultAvatar}/>
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
          <Button onClick={this.onClose.bind(this)}>{strings.close}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
