// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import "moment/locale/fa";
import Push from "push.js";
import MetaTags from "react-meta-tags";

//strings

//actions
import {threadCreateWithExistThread} from "../../actions/threadActions";
import strings from "../../constants/localization";
import {isFile} from "./MainMessagesMessage";
import {isOwner} from "./ModalThreadInfoGroupMain";
import {isChannel} from "./Main";

//components

//styling
const defaultAvatar = "../../../styles/images/_common/default-avatar.png";

function isMessageByMe(message, user) {
  if (user) {
    if (message) {
      return message.participant.id === user.id;
    }
  }
}

@connect(store => {
  return {
    chatNotification: store.chatNotification,
    chatNotificationClickHook: store.chatNotificationClickHook,
    messageNew: store.messageNew,
    messagePinned: store.messagePinned,
    user: store.user.user,
    chatInstance: store.chatInstance.chatSDK,
  };
})
export default class Notification extends Component {

  constructor(props) {
    super(props);
    if (!Push.Permission.has()) {
      Push.Permission.request();
    }
    this.state = {
      defaultTitle: window.document.title || "...",
      title: this.props.title,
      showLastThread: false,
      thread: null,
      count: 0
    };
    window.addEventListener("focus", () => {
      this.setState({
        thread: null,
        count: 0
      });
      clearInterval(this.intervalId);
      this.intervalId = null;
    }, false);
  }

  shouldComponentUpdate(nextProps) {
    const {messageNew, messagePinned} = nextProps;
    const {messageNew: oldMessageNew, messagePinned: oldMessagePinned} = this.props;
    let newPinMessage = true;
    let newMessage = true;
    if (messagePinned) {
      if (oldMessagePinned) {
        if (messagePinned.id === oldMessagePinned.id) {
          newPinMessage = false;
        }
      }
    } else {
      newPinMessage = false;
    }
    /*    if (messageNew && messageNew.cache) {
          return;
        }*/
    if (messageNew) {
      if (oldMessageNew) {
        if (messageNew.time <= oldMessageNew.time) {
          newMessage = false;
        }
      }
    } else {
      newMessage = false;
    }

    if (newPinMessage || newMessage) {
      this.pinNotify = newPinMessage;
      return true;
    }
  }

  componentDidUpdate(oldProps) {
    if (Push.Permission.request() && this.props.chatNotification) {
      const {messageNew, chatInstance, dispatch, user, chatNotificationClickHook, messagePinned} = this.props;
      const {messagePinned: oldMessagePinned, messageNew: oldMessageNew} = oldProps;
      if (!messageNew && !messagePinned) {
        return;
      }
      let messageToNotify = this.pinNotify ? messagePinned : messageNew;
      if (this.pinNotify || !isMessageByMe(messageToNotify, user)) {
        if (chatInstance) {
          if (this.pinNotify || !window.document.hasFocus()) {
            chatInstance.getThreadInfo({threadIds: messageToNotify.threadId}).then(thread => {
              if (this.pinNotify) {
                if (isOwner(thread, user)) {
                  return;
                }
              }
              if (thread.mute) {
                return;
              }
              const {count} = this.state;
              this.setState({
                thread,
                count: count + 1
              });
              if (!this.intervalId) {
                this.intervalId = window.setInterval(e => {
                  const {showLastThread} = this.state;
                  this.setState({
                    showLastThread: !showLastThread
                  })
                }, 1500);
              }
              const isMessageFile = isFile(messageToNotify);
              const tag = document.createElement("div");
              tag.innerHTML = messageToNotify.message;
              const newMessageText = messageToNotify.message;
              const personName = `${thread.group ? `${messageToNotify.participant && (messageToNotify.participant.contactName || messageToNotify.participant.name)}: ` : ""}`;
              let notificationMessage = `${personName}${isMessageFile ? newMessageText ? newMessageText : strings.sentAFile : tag.innerText}`;
              if (this.pinNotify) {
                notificationMessage = strings.personPinnedMessage(isChannel(thread));
              }
              Push.create(thread.title, {
                body: notificationMessage,
                icon: thread.image || defaultAvatar,
                timeout: 60000,
                onClick: function () {
                  if (chatNotificationClickHook) {
                    chatNotificationClickHook(thread);
                  }
                  dispatch(threadCreateWithExistThread(thread));
                  window.focus();
                  this.close();
                }
              });
            })
          }
        }
      }
    }
  }

  render() {
    if (!Push.Permission.request() || !this.props.chatNotification) {
      return null;
    }
    const {count, showLastThread, thread, defaultTitle} = this.state;
    let newTitle = defaultTitle;
    if (count > 0) {
      if (showLastThread) {
        newTitle = `${thread.title}...`;
      } else {
        newTitle = `💬 (${count}) - ${defaultTitle}`;
      }
    }
    return (
      <MetaTags>
        <title>{newTitle}</title>
      </MetaTags>
    )
  }
}