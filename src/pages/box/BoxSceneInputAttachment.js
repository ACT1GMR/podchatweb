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
import style from "../../../styles/pages/box/BoxSceneInputAttachment.scss";
import styleVar from "./../../../styles/variables.scss";

@connect(store => {
  return {
    threadFilesToUpload: store.threadFilesToUpload
  };
})
export default class BoxSceneInputAttachment extends Component {

  constructor() {
    super();
    this.onAttachmentChange = this.onAttachmentChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {threadFilesToUpload} = this.props;
    if (threadFilesToUpload) {
      if (prevProps.threadFilesToUpload !== threadFilesToUpload) {
        this.onAttachmentChange(null, threadFilesToUpload);
      }
    }
  }

  onAttachmentChange(evt, files) {
    const {threadId, dispatch} = this.props;
    for (const file of files || evt.target.files) {
      dispatch(messageSendFile(file, threadId));
    }
  }

  render() {
    return (
      <Container inline className={style.BoxSceneInputAttachment} relative>
        <input className={style.BoxSceneInputAttachment__Button} type="file" onChange={this.onAttachmentChange} multiple/>
        <MdAttachFile size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
      </Container>
    );
  }
}