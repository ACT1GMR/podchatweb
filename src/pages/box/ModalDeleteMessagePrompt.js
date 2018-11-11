import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {messageDelete, messageModalDeletePrompt} from "../../actions/messageActions";
import {threadCheckedMessageList, threadSelectMessageShowing} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalFooter} from "raduikit/src/modal";
import {Button} from "raduikit/src/button";
import {Text} from "raduikit/src/typography";
import Container from "raduikit/src/container";


//styling
@connect(store => {
  return {
    isShowing: store.messageModalDeletePrompt.isShowing,
    message: store.messageModalDeletePrompt.message
  };
})
export default class ModalDeleteMessagePrompt extends Component {

  constructor(props) {
    super(props);
  }

  onRemove() {
    const {message, dispatch} = this.props;
    if (message instanceof Array) {
      for (const msg of message) {
        dispatch(messageDelete(msg.id, msg.editable));
      }
    } else {
      dispatch(messageDelete(message.id, message.editable));
    }
    dispatch(messageModalDeletePrompt(false));
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
  }

  onCancel() {
    this.props.dispatch(messageModalDeletePrompt(false));
  }

  render() {
    const {isShowing, smallVersion, message} = this.props;
    const isBatchMessage = message instanceof Array;
    return (
      <Modal isOpen={isShowing} onClose={this.onCancel.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalBody>
          <Container centerTextAlign>
            <Text bold
                  size="lg">{strings.areYouSureAboutDeletingMessage(isBatchMessage ? message.length : null)}؟</Text>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button text onClick={this.onRemove.bind(this)}>{strings.remove}</Button>
          <Button text onClick={this.onCancel.bind(this)}>{strings.cancel}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
