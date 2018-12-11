// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {
  messageSendFile
} from "../../actions/messageActions";

//components
import Container from "../../../../uikit/src/container";
import {MdSentimentSatisfied} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainFooterInputEmoji.scss";
import styleVar from "../../../styles/variables.scss";

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
  }

  componentDidUpdate(prevProps) {
  }

  onAttachmentChange(evt) {
  }

  sendFiles(filesObject) {
  }

  onClick() {
  }

  render() {
    const {isSendingText} = this.props;
    return (
      <Container inline className={style.MainFooterInputEmoji} relative onClick={this.onClick}>
        <MdSentimentSatisfied size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
      </Container>
    );
  }
}