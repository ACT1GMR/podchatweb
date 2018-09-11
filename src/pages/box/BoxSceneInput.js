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
import BoxSceneInputAttachment from "./BoxSceneInputAttachment";
import Container from "raduikit/src/container";
import {MdChevronLeft} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneInput.scss";
import styleVar from "./../../../styles/variables.scss";
import BoxSceneInputEditing, {messageEditingCondition} from "./BoxSceneInputEditing";

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
    }
  }

  setInputText(text){
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
    const {messageEditing, threadId} = this.props;
    const {messageText} = this.state;

    const boxSceneInputClass = messageEditingCondition(messageEditing) ? `${style["BoxSceneInput__Text--halfBorder"]} ${style.BoxSceneInput__Text}` : style["BoxSceneInput__Text"];
    return (
      <Container className={style.BoxSceneInput}>
        <Container inline minWidth="calc(100% - 50px)" relative>
          <form onSubmit={this.onFormSubmit.bind(this, messageEditing)}>
            <BoxSceneInputEditing messageEditing={messageEditing} setInputText={this.setInputText}/>
            <input className={boxSceneInputClass}
                   ref={this.inputNode}
                   type="text"
                   placeholder={strings.pleaseWriteHere}
                   onChange={this.onTextChange}
                   value={messageText}/>
            <button type="submit" className={style.BoxSceneInput__Button}>
              <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorTextLight} style={{margin: "0 4px"}}/>
            </button>
          </form>
        </Container>
        <BoxSceneInputAttachment threadId={threadId}/>
      </Container>
    );
  }
}