// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import sanitizeHTML from "sanitize-html";
import {mobileCheck} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {
  messageEditing,
  messageSend,
  messageEdit,
  messageReply,
  messageForward, messageSendMock, messageSendOnTheFly
} from "../../actions/messageActions";
import {threadCreateWithUserWithMessage, threadEmojiShowing, threadIsSendingMessage} from "../../actions/threadActions";

//components
import MainFooterInputEmoji from "./MainFooterInputEmoji";
import MainFooterInputEditing, {messageEditingCondition} from "./MainFooterInputEditing";
import Container from "../../../../uikit/src/container";
import {InputTextArea} from "../../../../uikit/src/input";


//styling
import style from "../../../styles/pages/box/MainFooterInput.scss";
import {codeEmoji} from "./MainFooterEmojiIcons";
import {startTyping, stopTyping} from "../../actions/chatActions";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

const sanitizeRule = {
  allowedTags: ["img", "br", "div"],

  allowedAttributes: {
    img: ["src", "style", "class", "name"]
  },
  allowedSchemes: ["data"],
  exclusiveFilter: function (frame) {
    if (frame.tag === "img") {
      if (!frame.attribs.class) {
        return true
      }
      if (!~frame.attribs.class.indexOf("emoji")) {
        return true;
      }
    }
  }
};

function clearHtml(html) {
  if (!html) {
    return html;
  }
  const document = window.document.createElement("div");
  document.innerHTML = html;
  const children = Array.from(document.childNodes);
  const removingIndexes = [];
  for (let child of children) {
    if (child.data) {
      break
    }
    if (child.innerText === "\n") {
      removingIndexes.push(children.indexOf(child));
      continue;
    }
    break;
  }
  const clonedChildren = [...children].reverse();
  for (let child of clonedChildren) {
    if (child.data) {
      break;
    }
    if (child.innerText === "\n") {
      removingIndexes.push(children.indexOf(child));
      continue;
    }
    break;
  }
  let filterChildren = [];
  if (removingIndexes.length) {
    let index = 0;
    for (const child of children) {
      if (removingIndexes.indexOf(index) === -1) {
        filterChildren.push(child);
      }
      index++;
    }
  } else {
    filterChildren = children;
  }
  const newText = window.document.createElement("div");
  filterChildren.map(e => newText.appendChild(e));
  return sanitizeHTML(newText.innerHTML.trim(), sanitizeRule);
}


@connect(store => {
  return {
    messageEditing: store.messageEditing,
    thread: store.thread.thread
  };
}, null, null, {withRef: true})
export default class MainFooterInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.setInputText = this.setInputText.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.typingTimeOut = null;
    this.typingSet = false;
    this.forwardMessageSent = false;
    this.inputNode = React.createRef();
    this.state = {
      messageText: ""
    };
  }

  setInputText(text, append) {
    const {dispatch, messageEditing, thread} = this.props;
    const {messageText} = this.state;
    const threadId = thread.id;
    let newText = text;
    if (append) {
      if (messageText) {
        newText = messageText + newText;
      }
    }
    this.setState({
      messageText: newText
    });
    if (newText) {
      if (newText.trim()) {
        return dispatch(threadIsSendingMessage(true));
      }
    }
    if (!this.forwardMessageSent && messageEditing) {
      if (messageEditing.type === constants.forwarding) {
        return;
      }
    }
    if (this.forwardMessageSent) {
      this.forwardMessageSent = false;
    }
    dispatch(threadIsSendingMessage(false));
  }

  focus() {
    const current = this.inputNode.current;
    if (current) {
      current.focus();
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(messageEditing());
    this.setInputText();
    dispatch(threadIsSendingMessage(false));
  }

  componentDidUpdate(prevProps) {
    const {dispatch, thread, messageEditing: msgEditing} = this.props;
    const threadId = thread.id;
    const {id: oldThreadId} = prevProps.thread;
    if (msgEditing !== prevProps.messageEditing) {
      this.focus();
    }
    if (oldThreadId !== threadId) {
      if (msgEditing) {
        let emptyEditingCondition = msgEditing.type !== constants.forwarding || msgEditing.threadId ? msgEditing.threadId !== threadId : false;
        if (emptyEditingCondition) {
          dispatch(messageEditing());
          this.setInputText();
          dispatch(threadIsSendingMessage(false));
        }
      } else {
        this.setInputText();
        dispatch(threadIsSendingMessage(false));
      }
      if (!mobileCheck()) {
        this.focus();
      }
    }
  }

  sendMessage() {
    const {thread, dispatch, messageEditing: msgEditing} = this.props;
    const {messageText} = this.state;
    const {id: threadId} = thread;
    const clearMessageText = codeEmoji(clearHtml(messageText));
    let isEmptyMessage = false;
    if (!clearMessageText) {
      isEmptyMessage = true;
    }
    if (!isEmptyMessage) {
      if (!clearMessageText.trim()) {
        isEmptyMessage = true;
      }
    }

    if (!isEmptyMessage) {
      if (clearMessageText.length > 4096) {
        return
      }
    }
    if (msgEditing) {
      const msgEditingId = msgEditing.message instanceof Array ? msgEditing.message.map(e => e.id) : msgEditing.message.id;
      if (msgEditing.type === constants.replying) {
        if (isEmptyMessage) {
          return;
        }
        dispatch(messageReply(clearMessageText, msgEditingId, threadId, msgEditing.message));
      } else if (msgEditing.type === constants.forwarding) {
        if (clearMessageText) {
          dispatch(messageSend(clearMessageText, threadId));
        }
        dispatch(messageForward(threadId, msgEditingId));
        this.forwardMessageSent = true;
      } else {
        if (isEmptyMessage) {
          return;
        }
        dispatch(messageEdit(clearMessageText, msgEditingId));
      }
    } else {
      if (isEmptyMessage) {
        return;
      }
      if (thread.onTheFly) {
        dispatch(messageSendOnTheFly(clearMessageText, threadId));
      } else {
        dispatch(messageSend(clearMessageText, threadId));
      }
    }
    dispatch(messageEditing());
    dispatch(threadEmojiShowing(false));
    this.setInputText("");
  }

  onTextChange(event, isOnBlur) {
    const {thread, dispatch} = this.props;
    const threadId = thread.id;
    if (!isOnBlur) {
      if (!thread.onTheFly) {
        clearTimeout(this.typingTimeOut);
        if (!this.typingSet) {
          this.typingSet = true;
          dispatch(startTyping(threadId));
        }
        this.typingTimeOut = setTimeout(e => {
          this.typingSet = false;
          dispatch(stopTyping());
        }, 1500);
      }
      this.setInputText(event);
    }
  }

  onInputKeyPress(evt) {
    if (!mobileCheck()) {
      if (evt.which === 13 && !evt.shiftKey) {
        this.props.dispatch(stopTyping());
        this.sendMessage();
        evt.preventDefault();
      }
    }
  }

  onPaste(e) {
    e.stopPropagation();
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
          <Container className={style.MainFooterInput__EditBoxInputContainer} onPaste={this.onPaste}>
            <InputTextArea
              className={style.MainFooterInput__InputContainer}
              inputClassName={style.MainFooterInput__Input}
              sanitizeRule={sanitizeRule}
              ref={this.inputNode}
              placeholder={strings.pleaseWriteHere}
              onChange={this.onTextChange}
              onKeyPress={this.onInputKeyPress}
              value={messageText}/>
          </Container>
          <Container centerLeft>
            <MainFooterInputEmoji inputNode={this.inputNode}/>
          </Container>
        </Container>
      </Container>
    );
  }
}