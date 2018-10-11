import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadFilesToUpload, threadModalImageCaptionShowing} from "../../actions/threadActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "raduikit/src/modal";
import Button from "raduikit/src/button";
import {Heading} from "raduikit/src/typography";
import List, {ListItem} from "raduikit/src/list";
import {InputText} from "raduikit/src/input";
import Container from "raduikit/src/container";
import Image from "raduikit/src/image";

//styling
import {messageSend} from "../../actions/messageActions";
import style from "../../../styles/pages/box/ModalImageCaption.scss";

@connect(store => {
  return {
    isShow: store.threadModalImageCaptionShowing,
    images: store.threadImagesToCaption,
    threadId: store.thread.thread.id
  };
})
export default class ModalImageCaption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
    this.onSend = this.onSend.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onSend() {
    const {threadId, dispatch, images} = this.props;
    const {comment} = this.state;
    if (comment) {
      if (comment.trim()) {
        dispatch(messageSend(comment, threadId));
      }
    }
    dispatch(threadFilesToUpload(images, true));
    this.onClose();
  }

  onClose() {
    this.setState({
      comment: ""
    });
    this.props.dispatch(threadModalImageCaptionShowing(false));
  }

  captionChange(event) {
    this.setState({
      comment: event.target.value
    });
  }

  render() {
    const {images, isShow, smallVersion} = this.props;
    const {comment} = this.state;

    return (

      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}>

        <ModalHeader>
          <Heading h3>{strings.sendingImages}</Heading>
        </ModalHeader>

        <ModalBody>
          {images ?
            <List>
              {Array.from(images).map(el => (
                <ListItem key={el.id} invert multiple>
                  <Container centerTextAlign>

                    <Image className={style.ModalImageCaption__Image} src={URL.createObjectURL(el)}/>

                  </Container>
                </ListItem>
              ))}
            </List>
            : ""}


        </ModalBody>

        <ModalFooter>

          <InputText onChange={this.captionChange.bind(this)}
                     value={comment}
                     placeholder={strings.imageText}/>
          <Button text onClick={this.onSend}>{strings.send}</Button>
          <Button text onClick={this.onClose}>{strings.cancel}</Button>

        </ModalFooter>

      </Modal>
    )
  }
}
