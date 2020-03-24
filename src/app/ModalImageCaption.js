import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../constants/localization";

//actions
import {threadFilesToUpload, threadModalImageCaptionShowing} from "../actions/threadActions";
import {messageSend} from "../actions/messageActions";

//UI components
import Modal, {ModalBody, ModalHeader, ModalFooter} from "../../../uikit/src/modal";
import {Button} from "../../../uikit/src/button";
import {Heading} from "../../../uikit/src/typography";
import List, {ListItem} from "../../../uikit/src/list";
import {InputText} from "../../../uikit/src/input";
import Container from "../../../uikit/src/container";
import Image from "../../../uikit/src/image";

//styling
import style from "../../styles/pages/box/ModalImageCaption.scss";
import InputTextArea from "../../../uikit/src/input/InputTextArea";
import {codeEmoji} from "./MainFooterEmojiIcons";
import {clearHtml} from "./MainFooterInput";

@connect(store => {
  return {
    isShow: store.threadModalImageCaptionShowing.isShowing,
    inputNode: store.threadModalImageCaptionShowing.inputNode,
    images: store.threadImagesToCaption,
    threadId: store.thread.thread.id
  };
}, null, null, {withRef: true})
export default class ModalImageCaption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
    this.onSend = this.onSend.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onSend(imagesArray) {
    const {threadId, dispatch, inputNode} = this.props;
    const {comment} = this.state;
    const isBiggerThanOne = imagesArray.length > 1;
    const clearMessageText = codeEmoji(clearHtml(comment, true));
    let isEmptyMessage = false;
    if (!clearMessageText) {
      isEmptyMessage = true;
    }
    if (!isEmptyMessage) {
      if (!clearMessageText.trim()) {
        isEmptyMessage = true;
      }
    }
    if (isBiggerThanOne) {
      if (!isEmptyMessage) {
        dispatch(messageSend(comment, threadId));
      }
    }
    dispatch(threadFilesToUpload(imagesArray, true, inputNode, !isBiggerThanOne && !isEmptyMessage ? clearMessageText : null));
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
      comment: event
    });
  }

  render() {
    const {images, isShow, smallVersion} = this.props;
    const {comment} = this.state;
    const imagesArray = images && Array.from(images);

    return (

      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.sendingImages}</Heading>
        </ModalHeader>

        <ModalBody>
          {images ?
            <List>
              {imagesArray.map(el => (
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

          <InputTextArea onChange={this.captionChange.bind(this)}
                         value={comment}
                         placeholder={strings.pleaseWriteHere}/>
          <Button text onClick={this.onSend.bind(this, imagesArray)}>{strings.send}</Button>
          <Button text onClick={this.onClose}>{strings.cancel}</Button>

        </ModalFooter>

      </Modal>
    )
  }
}
