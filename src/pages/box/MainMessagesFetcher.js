// src/list/BoxSceneMessages
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import date from "../../utils/date";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen, messageGet} from "../../actions/messageActions";
import {
  threadFilesToUpload,
  threadMessageGetListByMessageId,
  threadMessageGetListPartial,
  threadMessageGetList,
  threadCheckedMessageList,
  threadLeftAsideShowing
} from "../../actions/threadActions";

//components
import {ButtonFloating} from "../../../../uikit/src/button"
import List, {ListItem} from "../../../../uikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Paper from "../../../../uikit/src/paper";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import {Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";
import Scroller from "../../../../uikit/src/Scroller";
import MainMessagesFile from "./MainMessagesFile";
import MainMessagesText from "./MainMessagesText";

//styling
import {
  MdDoneAll,
  MdVideocam,
  MdDone,
  MdChatBubbleOutline,
  MdErrorOutline,
  MdSchedule,
  MdExpandMore,
  MdCameraAlt,
  MdInsertDriveFile
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessages.scss";
import styleVar from "./../../../styles/variables.scss";
import {THREAD_LEFT_ASIDE_SEEN_LIST} from "../../constants/actionTypes";

const statics = {
  historyFetchCount: 20,
};

function isMessageByMe(message, user) {

}

@connect(store => {
  return {
    thread: store.thread.thread,
    threadMessages: store.threadMessages
  };
})
export default class MainMessages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gotoBottomButtonShowing: false,
      newMessageUnreadCount: 0
    }
  }

  componentDidMount() {
    const {thread} = this.props;
    if (thread) {
      this._fetchHistory();
    }
  }

  componentDidUpdate(oldProps) {
    const {thread, threadMessages} = this.props;
    const {thread: oldThread} = oldProps;
    const {messages, hasNext, fetching} = threadMessages;
    const threadId = thread.id;

    //fetch message if thread change
    if (!oldThread || oldThread.id !== threadId) {
      return this._fetchHistory();
    }

    //scroll to message if have pending message to go
    if (!fetching) {
      return
    }
    if (this.hasPendingMessageToGo) {
      this.onGoToSpecificMessage(this.hasPendingMessageToGo);
      return this.hasPendingMessageToGo = null;
    }

    //new message coming scroll handle
    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.newMessage) {
        if (isMessageByMe(lastMessage)) {
          this.scroller.goto(true);
        } else {
          const currentScrollPosition = this.scroller.getInfo();
          if (!hasNext || currentScrollPosition.isInBottomThreshold) {
            this.scroller.goto(true);
          } else if (hasNext) {
            this.setState({
              newMessageUnreadCount: this.state.newMessageUnreadCount + 1
            });
          }
        }
      }
    }


  }

  _fetchHistory() {
    const {thread, dispatch, threadMessages} = this.props;
    if (thread.unreadCount > statics.historyFetchCount) {
      this.hasPendingMessageToGo = thread.lastSeenMessageId;
      dispatch(threadMessageGetListByMessageId(thread.id, statics.historyFetchCount, thread.lastSeenMessageTime));
    } else {
      if (thread.lastSeenMessageId !== thread.lastMessageVO.id) {
        this.hasPendingMessageToGo = thread.lastSeenMessageId;
      }
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    }
  }

  onGotoBottomButtonClick() {
    const {threadMessages, dispatch, thread} = this.props;
    const {hasNext} = threadMessages;
    if (hasNext) {
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    } else {
      this.scroller.goto(true);
    }
    this.setState({
      gotoBottomButtonShowing: false
    });
  }

  onScrollTopThreshold() {
    listing.getThreadHistory(statics.historyFetchCount, this.props.thread.id);
  }

  onScrollBottomThreshold() {
    listing.getThreadHistory(statics.historyFetchCount, this.props.thread.id, true);
  }

  onScrollBottomEnd() {
    this.setState({
      gotoBottomButtonShowing: false
    })
  }

  onGoToSpecificMessage(messageId, messageTime) {
    const {thread} = this.props;
    const result = this.scroller.goto(messageId);
    if (!result) {
      this.hasPendingMessageToGo = messageId;
      return dispatch(threadMessageGetListByMessageId(thread.id, statics.historyFetchCount, messageTime));
    }
    this.hasPendingMessageToGo = null;
  }

  render() {
    const {threadMessages} = this.props;
    const {hasPrevious, hasNext} = threadMessages;
    return <Scroller onScrollBottomEnd={this.onScrollBottomEnd}
                     onScrollBottomThreshold={this.onScrollBottomThreshold}
                     onScrollBottomThresholdCondition={hasNext}
                     onScrollTopThreshold={this.onScrollTopThreshold}
                     onScrollTopThresholdCondition={hasPrevious}>

    </Scroller>

  }
}