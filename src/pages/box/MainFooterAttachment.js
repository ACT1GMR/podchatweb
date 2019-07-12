// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {
  messageSendFile
} from "../../actions/messageActions";
import {threadFilesToUpload} from "../../actions/threadActions";


//components
import Container from "../../../../uikit/src/container";
import {MdAttachFile, MdChevronRight} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainFooterAttachment.scss";
import styleVar from "./../../../styles/variables.scss";

@connect(store => {
  return {
    threadFilesToUpload: store.threadFilesToUpload,
    threadId: store.thread.thread.id,
    isSendingText: store.threadIsSendingMessage
  };
})
export default class MainFooterAttachment extends Component {

  constructor() {
    super();
    this.onAttachmentChange = this.onAttachmentChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.fileInput = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const {threadFilesToUpload} = this.props;
    if (threadFilesToUpload) {
      if (prevProps.threadFilesToUpload !== threadFilesToUpload) {
        this.sendFiles(threadFilesToUpload);
      }
    }
  }

  onAttachmentChange(evt) {
    this.props.dispatch(threadFilesToUpload(evt.target.files, false, this.fileInput.current));
  }

  sendFiles(filesObject) {
    const {threadId, dispatch} = this.props;
    const files = filesObject.files;
    const caption = filesObject.caption;
    for (const file of files) {
      dispatch(messageSendFile(file, threadId, caption));
    }
  }

  onClick() {
    const {isSendingText, sendMessage} = this.props;
    if (isSendingText) {
      sendMessage();
    }
  }

  render() {
    const {isSendingText} = this.props;
    return (
      <Container className={style.MainFooterAttachment} inline relative onClick={this.onClick.bind(this)}>
        {
          isSendingText ?
            <Container>
              <MdChevronRight size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
            </Container>
            :
            <Container>
              <input className={style.MainFooterAttachment__Button} type="file" onChange={this.onAttachmentChange}
                     multiple ref={this.fileInput}/>
              <MdAttachFile size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
            </Container>
        }
      </Container>
    );
  }
}