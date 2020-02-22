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
    const {messageNew} = nextProps;
    const {messageNew: oldMessageNew} = this.props;
    if (messageNew && messageNew.cache) {
      return;
    }
    if (messageNew && oldMessageNew) {
      if (messageNew.time < oldMessageNew.time) {
        return false;
      }
    }
    return true;
  }

  componentDidUpdate(oldProps) {
    if (Push.Permission.request() && this.props.chatNotification) {
      const {messageNew, chatInstance, dispatch, user, chatNotificationClickHook} = this.props;
      const {messageNew: oldMessageNew} = oldProps;
      if (messageNew && oldMessageNew) {
        if (messageNew.time < oldMessageNew.time) {
          return;
        }
      }
      if (!isMessageByMe(messageNew, user)) {
        if (chatInstance) {
          if (!window.document.hasFocus()) {
            if (messageNew === oldMessageNew) {
              return;
            }
            chatInstance.getThreadInfo({threadIds: messageNew.threadId}).then(thread => {
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
              const isMessageFile = isFile(messageNew);
              const tag = document.createElement("div");
              const text = messageNew.message;
              tag.innerHTML = messageNew.message;
              const newMessageText = messageNew.message;
              const personName = `${thread.group ? `${messageNew.participant && (messageNew.participant.contactName || messageNew.participant.name)}: ` : ""}`;
              const notificationMessage = `${personName}${isMessageFile ? newMessageText ? newMessageText : strings.sentAFile : tag.innerText}`;
              Push.create(thread.title, {
                body: notificationMessage,
                icon: thread.image || defaultAvatar,
                timeout: 60000,
                onClick: function () {
                  if (chatNotificationClickHook) {
                    chatNotificationClickHook(thread);
                  }
                  dispatch(threadCreateWithExistThread( thread));
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
    if (!this.props.chatNotificationEnabled) {
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