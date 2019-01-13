import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {chatModalPrompt} from "../../actions/chatActions";

//UI components
import Modal, {ModalBody, ModalFooter} from "../../../../uikit/src/modal";
import {Button} from "../../../../uikit/src/button";
import {Text} from "../../../../uikit/src/typography";
import Container from "../../../../uikit/src/container";

//styling

@connect(store => {
  return {
    isShowing: store.chatModalPrompt.isShowing,
    confirmText: store.chatModalPrompt.confirmText,
    message: store.chatModalPrompt.message,
    onApply: store.chatModalPrompt.onApply,
    onCancel: store.chatModalPrompt.onCancel
  };
}, null, null, {withRef: true})
export default class ModalPrompt extends Component {

  constructor(props) {
    super(props);
  }

  onClose() {
    const {dispatch, onCancel} = this.props;
    dispatch(chatModalPrompt());
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const {isShowing, smallVersion, message, onApply, confirmText} = this.props;
    return (
      <Modal isOpen={isShowing} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion} userSelect="none" wrapContent>

        <ModalBody>
          <Container centerTextAlign>
            <Text bold
                  size="lg">{message}</Text>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Button text onClick={onApply}>{confirmText || strings.remove}</Button>
          <Button text onClick={this.onClose.bind(this)}>{strings.cancel}</Button>
        </ModalFooter>

      </Modal>
    )
  }
}
