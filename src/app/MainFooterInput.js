// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import sanitizeHTML from "sanitize-html";
import {mobileCheck} from "../utils/helpers";
import Cookies from "js-cookie";

//strings
import strings from "../constants/localization";
//actions
import {
  messageEdit,
  messageEditing,
  messageForward, messageForwardOnTheFly,
  messageReply,
  messageSend,
  messageSendOnTheFly
} from "../actions/messageActions";
import {threadDraft, threadEmojiShowing, threadIsSendingMessage} from "../actions/threadActions";
//components
import MainFooterInputEmoji from "./MainFooterInputEmoji";
import MainFooterInputEditing, {messageEditingCondition} from "./MainFooterInputEditing";
import Container from "../../../uikit/src/container";
import {InputTextArea} from "../../../uikit/src/input";
//styling
import style from "../../styles/pages/box/MainFooterInput.scss";
import {codeEmoji, emojiRegex} from "./MainFooterEmojiIcons";
import {startTyping, stopTyping} from "../actions/chatActions";
import MainFooterInputParticipants from "./MainFooterInputParticipants";
import OutsideClickHandler from "react-outside-click-handler";
import {emojiCookieName} from "../constants/emoji";
import {MESSAGE_SHARE} from "../constants/cookie-keys";

export const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

export function sanitizeRule(isSendingMessage) {
  return {
    allowedTags: isSendingMessage ? ["img"] : ["img", "br", "div"],
    allowedAttributes: {
      img: ["src", "style", "class", "alt"]
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
  }
}

export function clearHtml(html, clearTags) {
  if (!html) {
    return html;
  }
  const document = window.document.createElement("div");
  document.innerHTML = html;
  const children = Array.from(document.childNodes);
  const removingIndexes = [];
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

  filterChildren.map(e => {
    let node = e;
    if (clearTags) {
      if (e.tagName === "BR") {
        node = window.document.createTextNode("\n");
      } else if (e.tagName === "DIV") {
        let countOfN = "";
        if (e.children.length) {
          for (const child of e.children) {
            if (child.tagName === "BR") {
              countOfN += "\n";
            }
          }
        } else {
          countOfN = `\n${e.innerText}`
        }
        node = window.document.createTextNode(countOfN);
      }
    }
    newText.appendChild(node)
  });
  return sanitizeHTML(newText.innerHTML.trim(), sanitizeRule(clearTags)).trim();
}

function isEmptyTag(text) {
  if (text.indexOf("img") >= 0) {
    return false;
  }
  const elem = window.document.createElement("div");
  elem.innerHTML = text;
  return !(elem.innerText && elem.innerText.trim());
}

function getCursorMentionMatch(messageText, inputNode, isSetMode, replaceText) {
  if (!messageText) {
    return false;
  }
  const cursorPosition = inputNode.getCaretPosition();
  const sliceMessage = messageText.slice(0, cursorPosition);

  function isBeforeAtSignValid(currentPosition) {
    let beforeAtSignChar = sliceMessage[currentPosition - 1];
    if (!beforeAtSignChar || beforeAtSignChar === " " || beforeAtSignChar === "\n") {
      return true;
    }
  }

  if (!isSetMode) {
    if (isBeforeAtSignValid(sliceMessage.length - 1) && sliceMessage[sliceMessage.length - 1] === "@") {
      return true;
    }
  }
  const mentionMatches = sliceMessage.match(/@[0-9a-z\u0600-\u06FF](\.?[0-9a-z\u0600-\u06FF])*/gm);
  if (!isSetMode) {
    if (!mentionMatches) {
      return false;
    }
  }
  const lastMentionIndex = sliceMessage.lastIndexOf("@");
  if (isSetMode) {
    let modifiedReplaceText = `@${replaceText}`;
    if (!messageText[cursorPosition + 1] || messageText[cursorPosition] !== " ") {
      modifiedReplaceText += " ";
    }
    return `${sliceMessage.substr(0, lastMentionIndex)}${modifiedReplaceText}${messageText.substr(cursorPosition)}`;
  }
  const lastMentionedSliceMessage = sliceMessage.slice(lastMentionIndex, sliceMessage.length);
  const matches = lastMentionedSliceMessage.match(/\s+/g);
  if (matches) {
    return false;
  }
  if (!isBeforeAtSignValid(lastMentionIndex)) {
    return false;
  }
  return mentionMatches[mentionMatches.length - 1].replace("@", "");
}

@connect(store => {
  return {
    messageEditing: store.messageEditing,
    thread: store.thread.thread,
    threadMessages: store.threadMessages,
    user: store.user.user,
    threadShowing: store.threadShowing
  };
}, null, null, {withRef: true})
export default class MainFooterInput extends Component {

  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);
    this.setInputText = this.setInputText.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputKeyUp = this.onInputKeyUp.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.onParticipantSelect = this.onParticipantSelect.bind(this);
    this.resetParticipantSuggestion = this.resetParticipantSuggestion.bind(this);
    this.mainFooterInputParticipantsRef = React.createRef();
    this.typingTimeOut = null;
    this.typingSet = false;
    this.forwardMessageSent = false;
    this.inputNode = React.createRef();
    this.lastTypingText = null;
    this.state = {
      showParticipant: false,
      messageText: ""
    };
  }

  setInputText(text, append) {
    const {dispatch, messageEditing, thread} = this.props;
    const {messageText} = this.state;
    let newText = text;
    if (append) {
      if (messageText) {
        const caretPosition = this.inputNode.current.getLastCaretPosition();
        const div = document.createElement("div");
        div.innerHTML = messageText;
        newText = div.innerHTML.slice(0, caretPosition) + newText + div.innerHTML.slice(caretPosition);
      }
    }
    this.setState({
      messageText: newText
    });
    if (newText) {
      if (newText.trim()) {
        if (clearHtml(newText) && !isEmptyTag(newText)) {
          this._setDraft(thread.id, newText);
          return dispatch(threadIsSendingMessage(true));
        }
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
    this._clearDraft(thread.id);
    dispatch(threadIsSendingMessage(false));
  }

  focus() {
    const current = this.inputNode.current;
    if (current) {
      current.focus();
    }
  }

  componentDidMount() {
    const {thread, dispatch} = this.props;
    dispatch(messageEditing());
    let draftMessage;
    if (thread && thread.id) {
      draftMessage = Cookies.get(MESSAGE_SHARE) || Cookies.get(thread.id) || null;
      if (draftMessage) {
        draftMessage = this._analyzeDraft(draftMessage);
      }
    }
    this.setInputText(draftMessage);
    dispatch(threadIsSendingMessage(!!draftMessage));
  }

  componentDidUpdate(prevProps) {
    const {dispatch, thread, messageEditing: msgEditing, threadMessages, threadShowing} = this.props;
    const {threadMessages: oldThreadMessages, threadShowing: oldThreadShowing} = prevProps;
    const threadId = thread.id;
    const {id: oldThreadId} = prevProps.thread;
    const isThreadHide = oldThreadShowing && !threadShowing;
    const storeDraftCondition = oldThreadId !== threadId || isThreadHide;
    if (msgEditing !== prevProps.messageEditing) {
      this.focus();
    }
    if (storeDraftCondition) {
      if (this.lastTypingText) {
        dispatch(threadDraft(isThreadHide ? threadId : oldThreadId, this.lastTypingText));
      } else {
        dispatch(threadDraft(isThreadHide ? threadId : oldThreadId));
      }
      let draftMessage = Cookies.get(thread.id) || (threadId ? Cookies.get(threadId) : null);
      if (draftMessage) {
        draftMessage = this._analyzeDraft(draftMessage);
      }
      if (msgEditing) {
        let emptyEditingCondition = msgEditing.type !== constants.forwarding || msgEditing.threadId ? msgEditing.threadId !== threadId : false;
        if (emptyEditingCondition) {
          dispatch(messageEditing());
          this.setInputText(draftMessage);
          dispatch(threadIsSendingMessage(!!draftMessage));
        }
      } else {
        this.setInputText(draftMessage);
        dispatch(threadIsSendingMessage(!!draftMessage));
      }
      if (!mobileCheck()) {
        this.focus();
      }
    } else {
      if (!mobileCheck()) {
        const {fetching, threadId: threadMessagesThreadId} = threadMessages;
        if (threadMessagesThreadId === threadId) {
          if (oldThreadMessages.fetching) {
            if (!fetching) {
              this.focus();
            }
          }
        }
      }
    }
  }

  componentWillUnmount() {
    const {dispatch, thread} = this.props;
    const threadId = thread.id;
    if (this.lastTypingText) {
      dispatch(threadDraft(threadId, this.lastTypingText));
    } else {
      dispatch(threadDraft(threadId));
    }
  }

  frequentlyEmojiUsed(text) {
    let emoji = text.match(emojiRegex());
    if (emoji) {
      const lastArray = Cookies.get(emojiCookieName);
      let parsedArray = lastArray ? JSON.parse(lastArray) : [];

      function buildText(count, char) {
        return `${count}|${char}`;
      }

      const newArray = [];

      function increaseCount(array, index) {
        const countAndChar = array[index].split("|");
        array[index] = buildText(++countAndChar[0], countAndChar[1]);
        array = parsedArray.sort(((a, b) => b.split('|')[0] - a.split('|')[0]));
      }

      for (let emoj of emoji) {
        const indexInArray = parsedArray.findIndex(e => e.indexOf(emoj) > -1);
        const indexInNewArray = newArray.findIndex(e => e.indexOf(emoj) > -1);
        if (indexInArray > -1) {
          increaseCount(parsedArray, indexInArray);
        } else {
          if (indexInNewArray > -1) {
            increaseCount(newArray, indexInNewArray);
          } else {
            if (parsedArray.length + newArray.length >= 36) {
              const lastEmoji = parsedArray[parsedArray.length - 1];
              parsedArray.splice(parsedArray.length - 1, 1);
              newArray.push(buildText(1, emoj));
            } else {
              newArray.push(buildText(1, emoj));
            }
          }

        }
      }
      Cookies.set(emojiCookieName, JSON.stringify(parsedArray.concat(newArray).sort(((a, b) => b.split('|')[0] - a.split('|')[0]))), {expires: 9999999999});
    }

  }

  sendMessage() {
    const {thread, dispatch, messageEditing: msgEditing, emojiShowing} = this.props;
    const {messageText} = this.state;
    const {id: threadId} = thread;
    const clearMessageText = codeEmoji(clearHtml(messageText, true));
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
      this.frequentlyEmojiUsed(clearMessageText);
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
          if (thread.onTheFly) {
            dispatch(messageForwardOnTheFly(msgEditingId, clearMessageText));
          } else {
            dispatch(messageSend(clearMessageText, threadId));
            dispatch(messageForward(threadId, msgEditingId));
          }
        } else {
          if (thread.onTheFly) {
            dispatch(messageForwardOnTheFly(msgEditingId));
          } else {
            dispatch(messageForward(threadId, msgEditingId));
          }
        }
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
        dispatch(messageSendOnTheFly(clearMessageText));
      } else {
        dispatch(messageSend(clearMessageText, threadId));
      }
    }
    dispatch(threadDraft(threadId));
    dispatch(messageEditing());
    if (mobileCheck()) {
      if (!emojiShowing) {
        this.focus();
      }
    } else {
      this.focus();
    }
    this.resetParticipantSuggestion();
    this.setInputText("");
  }

  _clearDraft(threadId) {
    Cookies.remove(threadId);
    Cookies.remove(MESSAGE_SHARE);
    this.lastTypingText = null;
  }

  _analyzeDraft(text) {
    const splitedText = text.split("|");
    if (splitedText.length > 1) {
      const message = JSON.parse(splitedText[1]);
      let type = splitedText[2];
      if (type === "undefined" || type === "null") {
        type = null;
        message.draftMode = true;
      }
      this.props.dispatch(messageEditing(message, type));
      return splitedText[0];
    }
    return splitedText[0];
  }

  _setDraft(threadId, text) {
    const {messageEditing, thread, user} = this.props;
    let concatText = "";
    if (messageEditing) {
      if (messageEditing.type !== constants.forwarding) {
        concatText += `|${JSON.stringify(messageEditing.message)}|${messageEditing.type}`;
      }
    }
    const finalText = `${text}${concatText}`;
    Cookies.set(threadId, finalText);
    this.lastTypingText = text;
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
      if (thread.group) {
        this.showParticipant(event);
      }
      this.setInputText(event);
    }
  }

  showParticipant(messageText) {
    const {showParticipant} = this.state;
    const lastMentionedMan = getCursorMentionMatch(messageText, this.inputNode.current);
    if (!lastMentionedMan) {
      if (showParticipant) {
        return this.setState({
          showParticipant: false
        });
      }
      return;
    }
    this.setState({
      showParticipant: true,
      filterString: lastMentionedMan === true ? null : lastMentionedMan
    });
  }

  onParticipantSelect(contact) {
    const {messageText} = this.state;
    if (!contact) {
      return this.sendMessage();
    }
    const newMessageText = getCursorMentionMatch(messageText, this.inputNode.current, true, contact.username);
    this.setInputText(newMessageText);
    setTimeout(() => this.focus(), 100);
    this.resetParticipantSuggestion();
  }

  removeBluish() {
    /*    const {messageText} = this.state;
        const lastMentionedMan = getCursorMentionMatch(messageText, this.inputNode.current);*/
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

  onInputKeyDown(evt) {
    if (this.props.thread.group) {
      const {showParticipant} = this.state;
      const {keyCode} = evt;
      if (showParticipant) {
        if (keyCode === 27) {
          this.resetParticipantSuggestion();
        }
        this.mainFooterInputParticipantsRef.current.getWrappedInstance().keyDownSignal(evt);
      }
    }
  }

  onInputKeyUp(evt) {
    this.onTextChange(evt.target.innerHTML);
  }

  onPaste(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onInputFocus(e) {
    const {emojiShowing, dispatch} = this.props;
    if (mobileCheck()) {
      if (emojiShowing) {
        dispatch(threadEmojiShowing(false));
      }
    }
  }

  resetParticipantSuggestion() {
    this.setState({
      showParticipant: false,
      filterString: null
    });
  }

  render() {
    const {messageEditing, thread, user} = this.props;
    const {messageText, showParticipant, filterString} = this.state;
    const editBotClassNames = classnames({
      [style.MainFooterInput__EditBox]: true,
      [style["MainFooterInput__EditBox--halfBorder"]]: messageEditingCondition(messageEditing)
    });
    const participantsPositionContainerClassNames =
      classnames({
        [style.MainFooterInput__ParticipantPositionContainer]: true,
        [style["MainFooterInput__ParticipantPositionContainer--mobile"]]: mobileCheck()
      });
    return (
      <Container className={style.MainFooterInput}>
        <OutsideClickHandler onOutsideClick={this.resetParticipantSuggestion}>
          {showParticipant &&

          <Container className={style.MainFooterInput__ParticipantContainer}>
            <Container className={participantsPositionContainerClassNames}>
              <MainFooterInputParticipants filterString={filterString} onSelect={this.onParticipantSelect} user={user}
                                           ref={this.mainFooterInputParticipantsRef}
                                           thread={thread}/>
            </Container>
          </Container>

          }
          <Container className={style.MainFooterInput__EditingBox}>
            <MainFooterInputEditing messageEditing={messageEditing} setInputText={this.setInputText}/>
          </Container>
          <Container relative className={editBotClassNames}>
            <Container className={style.MainFooterInput__EditBoxInputContainer} onPaste={this.onPaste}>
              <InputTextArea
                ref={this.inputNode}
                className={style.MainFooterInput__InputContainer}
                inputClassName={style.MainFooterInput__Input}
                sanitizeRule={sanitizeRule()}
                placeholder={strings.pleaseWriteHere}
                onFocus={this.onInputFocus}
                onChange={this.onTextChange}
                onKeyPress={this.onInputKeyPress}
                onKeyDown={this.onInputKeyDown}
                onKeyUp={this.onInputKeyUp}
                value={messageText}/>
            </Container>
            <Container centerLeft>
              <MainFooterInputEmoji inputNode={this.inputNode}/>
            </Container>
          </Container>
        </OutsideClickHandler>
      </Container>
    );
  }
}