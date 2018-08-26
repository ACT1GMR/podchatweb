import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadModalMediaShowing} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import {InputText} from "raduikit/src/input";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import Message from "raduikit/src/message";
import Container from "raduikit/src/container";


//styling

@connect(store => {
  return {
    object: store.threadModalMedialShowing.object
  };
})
export default class BoxModalAddContact extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
  }

  onSubmit() {
  }

  onCancel() {
    this.props.dispatch(threadModalMediaShowing(false));
  }

  render() {
    const {isOpen, object} = this.props;
    return (
      <Modal isOpen={object.isShowing} onClose={this.onCancel.bind(this)}>

        <ModalBody>
          <img src={object.src} style={{maxWidth: "100%"}}/>
        </ModalBody>

      </Modal>
    )
  }
}
