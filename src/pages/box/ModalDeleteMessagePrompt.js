import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {messageDelete, messageModalDeletePrompt} from "../../actions/messageActions";

//UI components
import Modal, {ModalBody, ModalFooter} from "raduikit/src/modal";
import {Button} from "raduikit/src/button";
import {Text} from "raduikit/src/typography";
import Container from "raduikit/src/container";


//styling
@connect(store => {
  return {
    isShowing: store.messageModalDeletePrompt.isShowing,
    messageId: store.messageModalDeletePrompt.messageId
  };
})
export default class ModalDeleteMessagePrompt extends Component {

  constructor(props) {
    super(props);
  }

  onRemove() {
    const {messageId, dispatch} = this.props;
    dispatch(messageDelete(messageId));
    dispatch(messageModalDeletePrompt(false));
  }

  onCancel() {
    this.props.dispatch(messageModalDeletePrompt(false));
  }

  render() {
    const {isShowing, smallVersion} = this.props;
    return (
      <Modal isOpen={isShowing} onClose={this.onCancel.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalBody>
          <Container centerTextAlign>
            <Text bold size="lg">{strings.areYouSureAboutDeletingMessage}؟</Text>
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
