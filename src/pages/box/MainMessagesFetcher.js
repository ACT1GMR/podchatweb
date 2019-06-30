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
    threadMessages: store.threadMessages,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    threadGetMessageListByMessageIdFetching: store.threadGetMessageListByMessageId.fetching,
    newMessage: store.newMessage,
  };
})
export default class MainMessages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gotoBottomButtonShowing: false,
      newMessageUnreadCount: 0
    };
    this.scroller = React.createRef();
    this.onScrollBottomEnd = this.onScrollBottomEnd.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onScrollTopThreshold = this.onScrollTopThreshold.bind(this);
    //Controller fields
    this.gotoBottom = false;
    this.hasPendingMessageToGo = null;
  }

  componentDidMount() {
    const {thread} = this.props;
    if (thread) {
      this._fetchHistory();
    }
  }

  componentDidUpdate(oldProps) {
    const {thread, threadMessages, newMessage, threadGetMessageListByMessageIdFetching} = this.props;
    const {thread: oldThread, newMessage: oldNewMessage} = oldProps;
    const {messages, hasNext, fetching} = threadMessages;
    const threadId = thread.id;

    //fetch message if thread change
    if (!oldThread || oldThread.id !== threadId) {
      return this._fetchHistory();
    }

    //scroll to message if have pending message to go
    if (fetching || threadGetMessageListByMessageIdFetching) {
      return
    }

    if (this.hasPendingMessageToGo) {
      return this.goToSpecificMessage(this.hasPendingMessageToGo);
    }

    if (this.gotoBottom) {
      this.scroller.current.gotoBottom();
      return this.gotoBottom = false;
    }

    //new message coming scroll handle
    if (newMessage !== oldNewMessage) {
      if (newMessage.threadId === thread.id) {
        if (isMessageByMe(newMessage)) {
          dispatch(threadNewMessage(newMessage));
          this.scroller.current.gotoBottom();
        } else {
          const currentScrollPosition = this.scroller.current.getInfo();
          if (!hasNext || currentScrollPosition.isInBottom) {
            this.scroller.current.gotoBottom(true);
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
    const {thread, dispatch} = this.props;
    if (thread.unreadCount > statics.historyFetchCount) {
      this.hasPendingMessageToGo = thread.lastSeenMessageTime;
      this._fetchHistoryFromMiddle(thread.id, thread.lastSeenMessageTime);
    } else {
      if (thread.lastSeenMessageId === thread.lastMessageVO.id) {
        this.gotoBottom = true;
      } else {
        this.hasPendingMessageToGo = thread.lastMessageVO.time;
      }
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    }
  }

  _fetchHistoryFromMiddle(threadId, messageTime) {
     this.props.dispatch(threadMessageGetListByMessageId(threadId, messageTime, statics.historyFetchCount));
     this.setState({
       bottomButton: true
     });
  }

  onGotoBottomClicked() {
    const {threadMessages, dispatch, thread} = this.props;
    const {hasNext} = threadMessages;
    if (hasNext) {
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    } else {
      this.scroller.current.gotoBottom(true);
    }
    this.setState({
      gotoBottomButtonShowing: false
    });
  }

  onScrollTopThreshold() {
    const {thread, threadMessages, dispatch} = this.props;
    const {messages} = threadMessages;
    dispatch(threadMessageGetListPartial(thread.id, messages[0].time, false, statics.historyFetchCount));
  }

  onScrollBottomThreshold() {
    const {thread, threadMessages, dispatch} = this.props;
    const {messages} = threadMessages;
    dispatch(threadMessageGetListPartial(thread.id, messages[messages.length - 1].time, true, statics.historyFetchCount));
  }

  onScrollBottomEnd() {
    this.setState({
      gotoBottomButtonShowing: false
    });
  }

  goToSpecificMessage(messageTime) {
    const {thread, dispatch} = this.props;
    const result = this.scroller.current.gotoElement(`message-${messageTime}`);
    if (!result) {
      this.hasPendingMessageToGo = messageTime;
      this._fetchHistoryFromMiddle(thread.id, messageTime);
    }
    this.hasPendingMessageToGo = null;
  }

  render() {
    const {threadMessages, threadMessagesPartialFetching} = this.props;
    const {messages} = threadMessages;
    const {hasPrevious, hasNext} = threadMessages;
    return <section className={style.MainMessages}>
      <Scroller ref={this.scroller}
                threshold={5}
                onScrollBottomEnd={this.onScrollBottomEnd}
                onScrollBottomThreshold={this.onScrollBottomThreshold}
                onScrollBottomThresholdCondition={hasNext}
                onScrollTopThreshold={this.onScrollTopThreshold}
                onScrollTopThresholdCondition={hasPrevious && !threadMessagesPartialFetching}>
        {messages.map(el =>
          <div id={`message-${el.time}`} style={{height: "200px", width: "200px"}}>
            {el.message}
          </div>
        )}
      </Scroller>
    </section>
  }
}