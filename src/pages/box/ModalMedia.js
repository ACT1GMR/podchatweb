import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadModalMediaShowing} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody} from "raduikit/src/modal";
import Image from "raduikit/src/image";

//styling
import style from "../../../styles/pages/box/ModalMedia.scss";

@connect(store => {
  return {
    object: store.threadModalMedialShowing.object
  };
})
export default class ModalAddContact extends Component {

  constructor(props) {
    super(props);
  }

  onCancel() {
    this.props.dispatch(threadModalMediaShowing(false));
  }

  render() {
    const {object, smallVersion} = this.props;
    return (
      <Modal isOpen={object.isShowing} onClose={this.onCancel.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalBody>
          <Image className={style.ModalMedia__Img} src={object.src} style={{maxWidth: "100%"}}/>
        </ModalBody>

      </Modal>
    )
  }
}
