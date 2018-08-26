// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {
  messageSend,
  messageEditing,
  messageEdit,
  messageReply,
  messageForward,
  messageSendFile
} from "../../actions/messageActions";

//components
import Paper from "raduikit/src/paper";
import Container from "raduikit/src/container";
import {MdClose, MdChevronLeft, MdAttachFile} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneInput.scss";
import styleVar from "./../../../styles/variables.scss";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

@connect(store => {
  return {
    messageEditing: store.messageEditing.message,
    threadId: store.thread.thread.id,
    threadFetching: store.thread.thread.id
  };
})
export default class BoxSceneInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onCancelEditing = this.onCancelEditing.bind(this);
    this.onAttachmentChange = this.onAttachmentChange.bind(this);
    this.inputNode = React.createRef();
    this.state = {
      messageText: ""
    }
  }

  componentDidUpdate(prevProps) {
    const {messageEditing} = this.props;
    if (messageEditing) {
      if (messageEditing.type !== constants.replying) {
        if (prevProps.messageEditing !== messageEditing) {
          if (messageEditing.type !== constants.replying && messageEditing.type !== constants.forwarding) {
            this.setState({
              messageText: messageEditing.text ? messageEditing.text : ""
            });
          }
        }
      }
    }
    const current = this.inputNode.current;
    if (current) {
      current.focus();
    }
  }

  onAttachmentChange(evt) {
    const {threadId, dispatch} = this.props;
    const file = evt.target.files[0];
    dispatch(messageSendFile(file, threadId));
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
      const msgEditingId = msgEditing.id;
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
    this.setState({messageText: ""});
  }

  onTextChange(event) {
    this.setState({messageText: event.target.value});
  }

  onCancelEditing(event, id) {
    this.props.dispatch(messageEditing());
  }

  render() {
    const {messageEditing} = this.props;
    const {messageText} = this.state;
    const messageEditCondition = messageEditing && messageEditing.text;
    let editingPopup = messageEditCondition ?
      <Container relative>
        <Paper colorBackgroundLight borderRadius="5px 5px 0 0">
          {messageEditing.text}
          <Container inline left>
            <MdClose size={styleVar.iconSizeSm} color={styleVar.colorTextLight} style={{margin: "0 4px"}}
                     className={"u-clickable u-hoverColorAccent"} onClick={this.onCancelEditing}/>
          </Container>
        </Paper>
      </Container> : '';
    const boxSceneInputClass = messageEditCondition ? `${style["BoxSceneInput__Text--halfBorder"]} ${style.BoxSceneInput__Text}` : style["BoxSceneInput__Text"];
    return (
      <Container className={style.BoxSceneInput}>
        <Container inline minWidth="calc(100% - 50px)" relative>
          <form onSubmit={this.onFormSubmit.bind(this, messageEditing)}>
            {editingPopup}
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
        <Container inline className={style.BoxSceneInput__Attach} relative>
          <input className={style.BoxSceneInput__AttachButton} type="file" onChange={this.onAttachmentChange}/>
          <MdAttachFile size={styleVar.iconSizeMd} color={styleVar.colorAccentDark} style={{margin: "3px 4px"}}/>
        </Container>
      </Container>
    );
  }
}