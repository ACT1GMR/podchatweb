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
  messageForward
} from "../../actions/messageActions";
import {threadIsSendingMessage} from "../../actions/threadActions";

//components
import MainFooterInputEmoji from "./MainFooterInputEmoji";
import MainFooterInputEditing, {messageEditingCondition} from "./MainFooterInputEditing";
import Container from "../../../../uikit/src/container";
import {InputTextArea} from "../../../../uikit/src/input";


//styling
import style from "../../../styles/pages/box/MainFooterInput.scss";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

const sanitizeRule = {
  allowedTags: ["img", "br", "div"],

  allowedAttributes: {
    img: ["src", "style", "class"]
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
    threadId: store.thread.thread.id
  };
}, null, null, {withRef: true})
export default class MainFooterInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.setInputText = this.setInputText.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
    this.inputNode = React.createRef();
    this.state = {
      messageText: ""
    };
  }

  setInputText(text, append) {
    const {dispatch, messageEditing} = this.props;
    const {messageText} = this.state;
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
    if (messageEditing) {
      if (messageEditing.type === constants.forwarding) {
        return;
      }
    }
    dispatch(threadIsSendingMessage(false));
  }

  componentDidMount() {
    const {dispatch, threadId, messageEditing: msgEditing} = this.props;
    dispatch(messageEditing());
    this.setInputText();
    dispatch(threadIsSendingMessage(false));
  }

  componentDidUpdate(prevProps) {
    const {dispatch, threadId, messageEditing: msgEditing} = this.props;
    if (msgEditing !== prevProps.messageEditing) {
      const current = this.inputNode.current;
      if (current) {
        current.focus();
      }
    }
    if (prevProps.threadId !== threadId) {
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
    const clearMessageText = clearHtml(messageText);
    let isEmptyMessage = false;
    if (!clearMessageText) {
      isEmptyMessage = true;
    }
    if (!clearMessageText.trim()) {
      isEmptyMessage = true;
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
      } else {
        if (isEmptyMessage) {
          return;
        }
        this.props.dispatch(messageEdit(clearMessageText, msgEditingId));
      }
    } else {
      if (isEmptyMessage) {
        return;
      }
      dispatch(messageSend(clearMessageText, threadId));
    }
    dispatch(messageEditing());
    this.setInputText("");
  }

  onTextChange(event) {
    this.setInputText(event);
  }

  onInputKeyPress(evt) {
    if (!mobileCheck()) {
      if (evt.which === 13 && !evt.shiftKey) {
        this.sendMessage();
        evt.preventDefault();
      }
    }
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
          <Container className={style.MainFooterInput__EditBoxInputContainer}>
            <InputTextArea
              className={style.MainFooterInput__InputContainer}
              sanitizeRule={sanitizeRule}
              inputClassName={style.MainFooterInput__Input}
              ref={this.inputNode}
              placeholder={strings.pleaseWriteHere}
              onChange={this.onTextChange}
              onKeyPress={this.onInputKeyPress}
              value={messageText}/>
          </Container>
          <Container centerLeft>
            <MainFooterInputEmoji/>
          </Container>
        </Container>
      </Container>
    );
  }
}