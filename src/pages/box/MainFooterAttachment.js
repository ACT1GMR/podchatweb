// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {
  messageSendFile
} from "../../actions/messageActions";

//components
import Container from "raduikit/src/container";
import {MdAttachFile} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainFooterAttachment.scss";
import styleVar from "./../../../styles/variables.scss";
import {threadFilesToUpload} from "../../actions/threadActions";

@connect(store => {
  return {
    threadFilesToUpload: store.threadFilesToUpload,
    threadId: store.thread.thread.id
  };
})
export default class MainFooterAttachment extends Component {

  constructor() {
    super();
    this.onAttachmentChange = this.onAttachmentChange.bind(this);
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
    this.props.dispatch(threadFilesToUpload(evt.target.files));
  }

  sendFiles(files) {
    const {threadId, dispatch} = this.props;
    for (const file of files) {
      dispatch(messageSendFile(file, threadId));
    }
  }

  render() {
    return (
      <Container inline className={style.MainFooterAttachment} relative>
        <input className={style.MainFooterAttachment__Button} type="file" onChange={this.onAttachmentChange} multiple/>
        <MdAttachFile size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
      </Container>
    );
  }
}