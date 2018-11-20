// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {mobileCheck} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {
  messageEditing,
  messageSend,
  messageEdit,
  messageReply,
  messageForward
} from "../../actions/messageActions";
import {threadIsSendingMessage} from "../../actions/threadActions";

//components
import MainFooterInputEditing, {messageEditingCondition} from "./MainFooterInputEditing";
import Container from "../../../../uikit/src/container";
import {InputTextArea} from "../../../../uikit/src/input";

//styling
import style from "../../../styles/pages/box/MainFooterInput.scss";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

@connect(store => {
  return {
    messageEditing: store.messageEditing,
    threadId: store.thread.thread.id
  };
}, null, null, {withRef: true})
export default class BoxSceneInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.setInputText = this.setInputText.bind(this);
    this.inputNode = React.createRef();
    this.state = {
      messageText: ""
    };
  }

  setInputText(text) {
    const {dispatch} = this.props;
    this.setState({
      messageText: text
    });
    if (text) {
      if (text.trim()) {
        return dispatch(threadIsSendingMessage(true));
      }
    }
    dispatch(threadIsSendingMessage(false));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.threadId !== this.props.threadId) {
      if (!mobileCheck()) {
        const current = this.inputNode.current;
        if (current) {
          current.focus();
        }
      }
    }
  }

  sendMessage() {
    const {threadId, dispatch, messageEditing: msgEditing} = this.props;
    const {messageText} = this.state;
    let isEmptyMessage = false;
    if (!messageText) {
      isEmptyMessage = true;
    }
    if (!messageText.trim()) {
      isEmptyMessage = true;
    }
    if (msgEditing) {
      const msgEditingId = msgEditing.message instanceof Array ? msgEditing.message.map(e => e.id) : msgEditing.message.id;
      if (msgEditing.type === constants.replying) {
        if (isEmptyMessage) {
          return;
        }
        dispatch(messageReply(messageText, msgEditingId, threadId));
      } else if (msgEditing.type === constants.forwarding) {
        if (messageText) {
          dispatch(messageSend(messageText, threadId));
        }
        dispatch(messageForward(threadId, msgEditingId));
      } else {
        if (isEmptyMessage) {
          return;
        }
        this.props.dispatch(messageEdit(messageText, msgEditingId));
      }
    } else {
      if (isEmptyMessage) {
        return;
      }
      dispatch(messageSend(messageText, threadId));
    }
    dispatch(messageEditing());
    this.setInputText("");
  }

  onTextChange(event) {
    this.setInputText(event.target.innerText);
  }

  render() {
    const {messageEditing} = this.props;
    const {messageText} = this.state;
    const editBotClassNames = classnames({
      [style.MainFooterInput__EditBox]: true,
      [style["MainFooterInput__EditBox--halfBorder"]]: messageEditingCondition(messageEditing)
    });
    return (
      <Container className={style.MainFooterInput}>
        <Container className={style.MainFooterInput__EditingBox}>
          <MainFooterInputEditing messageEditing={messageEditing} setInputText={this.setInputText}/>
        </Container>
        <Container relative className={editBotClassNames}>
          <InputTextArea
            className={style.MainFooterInput__InputContainer}
            inputClassName={style.MainFooterInput__Input}
            ref={this.inputNode}
            placeholder={strings.pleaseWriteHere}
            onChange={this.onTextChange}
            value={messageText}/>
        </Container>
      </Container>
    );
  }
}