// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import "moment/locale/fa";
import Push from "push.js";
import MetaTags from "react-meta-tags";
import {isFile} from "./MainMessagesFetcher";

//strings

//actions
import {threadCreate} from "../../actions/threadActions";
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
    messageNew: store.messageNew,
    user: store.user.user,
    chatInstance: store.chatInstance.chatSDK,
  };
})
export default class Notification extends Component {

  constructor(props) {
    super(props);
    this.lastTime = Date.now();
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


  componentDidUpdate(oldProps) {
    if (Push.Permission.request()) {
      const {messageNew, chatInstance, dispatch, user} = this.props;
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
            chatInstance.getThreadInfo(messageNew.threadId).then(thread => {
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
              tag.innerHTML = messageNew.message;
              const isEmoji = tag.innerText && tag.innerText.indexOf('img') > -1;
              Push.create(thread.title, {
                body: isMessageFile ? messageNew.message ? messageNew.message : strings.sentAFile : isEmoji ? strings.sentAMessage : tag.innerText,
                icon: thread.image || defaultAvatar,
                timeout: 60000,
                onClick: function () {
                  dispatch(threadCreate(null, thread));
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