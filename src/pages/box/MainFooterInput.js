// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";

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

//components
import MainFooterInputEditing, {messageEditingCondition} from "./MainFooterInputEditing";
import Container from "raduikit/src/container";
import {MdChevronLeft} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainFooterInput.scss";
import styleVar from "./../../../styles/variables.scss";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

@connect(store => {
  return {
    messageEditing: store.messageEditing,
    threadId: store.thread.thread.id
  };
})
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
    this.setState({
      messageText: text
    });
  }

  componentDidUpdate(prevProps) {
    const current = this.inputNode.current;
    if (current) {
      current.focus();
    }
  }

  onFormSubmit(msgEditing, evt) {
    evt.preventDefault();
    const {threadId, dispatch} = this.props;
    const {messageText} = this.state;
    let isEmptyMessage = false;
    if (!messageText) {
      isEmptyMessage = true;
    }
    if (!messageText.trim()) {
      isEmptyMessage = true;
    }
    if (msgEditing) {
      const msgEditingId = msgEditing.message.id;
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
    this.setInputText(event.target.value);
  }

  render() {
    const {messageEditing} = this.props;
    const {messageText} = this.state;
    const boxSceneInputClass = messageEditingCondition(messageEditing) ? `${style["MainFooterInput__Input--halfBorder"]} ${style.MainFooterInput__Input}` : style.MainFooterInput__Input;
    return (
      <Container className={boxSceneInputClass}>
        <Container className={style.MainFooterInput__EditingBox}>
          <MainFooterInputEditing messageEditing={messageEditing} setInputText={this.setInputText}/>
        </Container>
        <Container relative className={style.MainFooterInput__EditBox}>
          <form onSubmit={this.onFormSubmit.bind(this, messageEditing)}>
            <input className={boxSceneInputClass}
                   ref={this.inputNode}
                   type="text"
                   placeholder={strings.pleaseWriteHere}
                   onChange={this.onTextChange}
                   value={messageText}/>
            <button type="submit" className={style.MainFooterInput__Button}>
              <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorTextLight} style={{margin: "0 4px"}}/>
            </button>
          </form>
        </Container>
      </Container>
    );
  }
}