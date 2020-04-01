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
import {Text} from "../../../uikit/src/typography";
import Container from "../../../uikit/src/container";
import Image from "../../../uikit/src/image";
import Paper from "../../../uikit/src/paper";
import {
  MdInsertDriveFile
} from "react-icons/md";

//styling
import style from "../../styles/pages/box/ModalImageCaption.scss";
import InputTextArea from "../../../uikit/src/input/InputTextArea";
import {codeEmoji} from "./MainFooterEmojiIcons";
import {clearHtml} from "./MainFooterInput";
import {humanFileSize} from "../utils/helpers";
import Shape, {ShapeCircle} from "../../../uikit/src/shape";
import styleVar from "../../styles/variables.scss";

@connect(store => {
  return {
    isShow: store.threadModalImageCaptionShowing.isShowing,
    inputNode: store.threadModalImageCaptionShowing.inputNode,
    files: store.threadImagesToCaption || [],
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
    const {files, isShow, smallVersion} = this.props;
    const {comment} = this.state;
    let isAllImage = true;
    let isMultiple = false;

    if (files) {
      isMultiple = files.length > 1;
      for (let file of files) {
        if (!~file.type.indexOf("image")) {
          isAllImage = false;
          break;
        }
      }
    } else {
      isAllImage = false;
    }
    const fileArray = files && Array.from(files);
    const checkForModalBody = !isMultiple || (isMultiple && isAllImage);
    return (

      <Modal isOpen={isShow} onClose={this.onClose.bind(this)} inContainer={smallVersion} fullScreen={smallVersion}
             userSelect="none">

        <ModalHeader>
          <Heading h3>{strings.sendFiles(fileArray.length, isAllImage)}</Heading>
        </ModalHeader>
        {checkForModalBody &&
        <ModalBody>
          {isAllImage ?
            <List>
              {fileArray.map(el => (
                <ListItem key={el.id} invert multiple>
                  <Container centerTextAlign>

                    <Image className={style.ModalImageCaption__Image} src={URL.createObjectURL(el)}/>

                  </Container>
                </ListItem>
              ))}
            </List>
            : !isMultiple ?
              <Container>
                <Paper hasShadow style={{borderRadius: "5px", backgroundColor: "#effdde"}}>
                  <Container display="flex" alignItems="center">
                    <Container flex="1 1 0">
                      <Text wordWrap="breakWord" bold>
                        {fileArray[0].name}
                      </Text>
                      <Text size="xs" color="gray" dark>
                        {humanFileSize(fileArray[0].size, true)}
                      </Text>
                    </Container>
                    <Container flex="none">
                      <Shape color="accent" size="lg">
                        <ShapeCircle>
                          <MdInsertDriveFile size={styleVar.iconSizeSm}/>
                        </ShapeCircle>
                      </Shape>
                    </Container>
                  </Container>
                </Paper>

              </Container> : ""
          }
        </ModalBody>
        }
        <ModalFooter>
          {
            isMultiple && !isAllImage &&
            <Container>

              <Text bold>
                {strings.fileSelected(files.length)}
              </Text>

            </Container>
          }
          <InputTextArea onChange={this.captionChange.bind(this)}
                         value={comment}
                         placeholder={`${strings.comment}...`}/>
          <Button text onClick={this.onSend.bind(this, fileArray)}>{strings.send}</Button>
          <Button text onClick={this.onClose}>{strings.cancel}</Button>

        </ModalFooter>

      </Modal>
    )
  }
}
