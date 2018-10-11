// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";
import "moment/locale/fa";
import Push from "push.js";
import MetaTags from "react-meta-tags";

//strings
import strings from "../../constants/localization";

//actions
import {threadCreate} from "../../actions/threadActions";

//components

//styling
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";

function isMessageByMe(message, user) {
  if (user) {
    if (message) {
      return message.participant.id === user.id;
    }
  }
}

@connect(store => {
  return {
    newMessage: store.message.message,
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
    window.addEventListener("focus", (event) => {
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
      const {newMessage, chatInstance, dispatch, user} = this.props;
      if (!isMessageByMe(newMessage, user)) {
        if (chatInstance) {
          if (!window.document.hasFocus()) {
            if (newMessage === oldProps.newMessage) {
              return;
            }
            chatInstance.getThreadInfo(newMessage.threadId).then(thread => {
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
              Push.create(thread.title, {
                body: newMessage.message,
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