// src/list/BoxSceneMessages
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import {avatarNameGenerator, OnWindowFocusInOut, mobileCheck} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen} from "../../actions/messageActions";
import {
  threadMessageGetListByMessageId,
  threadMessageGetListPartial,
  threadMessageGetList,
  threadCheckedMessageList,
  threadNewMessage,
  threadFilesToUpload,
  threadCreateOnTheFly
} from "../../actions/threadActions";

//components
import {ButtonFloating} from "../../../../uikit/src/button"
import List, {ListItem} from "../../../../uikit/src/list"
import Avatar, {AvatarImage} from "../../../../uikit/src/avatar";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Container from "../../../../uikit/src/container";
import Message from "../../../../uikit/src/message";
import Scroller from "../../../../uikit/src/scroller";

//styling
import {
  MdChatBubbleOutline,
  MdExpandMore,
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessages.scss";
import styleVar from "./../../../styles/variables.scss";
import MainMessagesMessage from "./MainMessagesMessage";

const statics = {
  historyFetchCount: 20,
};

export function isMessageByMe(message, user, thread) {
  if (thread && user) {
    const isGroup = thread.group;
    if (isGroup) {
      if (thread.type === 8) {
        if (thread.inviter.id === user.id) {
          return true;
        }
      }
    }
  }
  if (message) {
    if (message) {
      if (!message.id) {
        return true;
      }
      if (user) {
        return message.participant.id === user.id;
      }
    }
  }

}

function messageSelectedCondition(message, threadCheckedMessageList) {
  const fileIndex = threadCheckedMessageList.findIndex((msg => msg.uniqueId === message.uniqueId));
  return fileIndex >= 0;
}

function showNameOrAvatar(message, messages) {
  const msgOwnerId = message.participant.id;
  const msgId = message.id || message.uniqueId;
  const index = messages.findIndex(e => e.id === msgId || e.uniqueId === msgId);
  if (~index) {
    const lastMessage = messages[index - 1];
    if (lastMessage) {
      if (lastMessage.participant.id === msgOwnerId) {
        return false;
      }
    }
    return true;
  }
}

function NoMessageFragment() {
  return (
    <Container className={style.MainMessages}>
      <Container center centerTextAlign relative style={{width: "100%"}}>
        <div className={style.MainMessages__Empty}/>
        <Message size="lg">{strings.thereIsNoMessageToShow}</Message>
        <MdChatBubbleOutline size={styleVar.iconSizeXlg} color={styleVar.colorAccent}/>
      </Container>
    </Container>
  )
}

function LoadingFragment() {
  return (
    <Container className={style.MainMessages}>
      <Container center centerTextAlign style={{width: "100%"}}>
        <Loading hasSpace><LoadingBlinkDots/></Loading>
      </Container>
    </Container>
  )
}

function PartialLoadingFragment() {
  return (
    <Container topCenter centerTextAlign style={{zIndex: 1}}>
      <Loading><LoadingBlinkDots size="sm"/></Loading>
    </Container>
  )
}

function messageTickFragment(message, onAddToCheckedMessage, threadCheckedMessageList) {
  const isExisted = messageSelectedCondition(message, threadCheckedMessageList);
  const classNames = classnames({
    [style.MainMessages__Tick]: true,
    [style["MainMessages__Tick--selected"]]: isExisted
  });
  return <Container className={classNames} onClick={onAddToCheckedMessage.bind(null, message, !isExisted)}/>;
}

function getAvatar(message, messages, onAvatarClick, thread, user) {
  const showAvatar = showNameOrAvatar(message, messages);
  const enableClickCondition = !isMessageByMe(message, user, thread) && thread.group;
  const fragment =
    showAvatar ?
      <Avatar onClick={enableClickCondition ? onAvatarClick.bind(null, message.participant) : null}
              cursor={enableClickCondition ? "pointer" : null}>
        <AvatarImage src={message.participant.image} text={avatarNameGenerator(message.participant.name).letter}
                     textBg={avatarNameGenerator(message.participant.name).color}/>
      </Avatar>
      :
      <div style={{width: "50px", display: "inline-block"}}/>;
  return showAvatar ?
    <Container inline inSpace style={{maxWidth: "50px", verticalAlign: "top"}}>
      {fragment}
    </Container> : fragment;
}

@connect(store => {
  return {
    thread: store.thread.thread,
    threadMessages: store.threadMessages,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    threadGetMessageListByMessageIdFetching: store.threadGetMessageListByMessageId.fetching,
    threadSelectMessageShowing: store.threadSelectMessageShowing,
    threadCheckedMessageList: store.threadCheckedMessageList,
    threadGoToMessageId: store.threadGoToMessageId,
    messageNew: store.messageNew,
    user: store.user.user,
  };
})
export default class MainMessages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bottomButtonShowing: false,
      highLightMessage: null,
      newMessageUnreadCount: 0
    };
    this.scroller = React.createRef();
    this.onScrollBottomEnd = this.onScrollBottomEnd.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onScrollTopThreshold = this.onScrollTopThreshold.bind(this);
    this.onScrollTop = this.onScrollTop.bind(this);
    this.onGotoBottomClicked = this.onGotoBottomClicked.bind(this);
    this.onAvatarClick = this.onAvatarClick.bind(this);
    this.onRepliedMessageClicked = this.onRepliedMessageClicked.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onPaste = this.onPaste.bind(this);
    document.body.addEventListener("paste", this.onPaste);

    //Controller fields
    this.gotoBottom = false;
    this.hasPendingMessageToGo = null;
    this.lastSeenMessage = null;
    this.windowFocused = true;

    if (!mobileCheck()) {
      OnWindowFocusInOut(() => this.windowFocused = false, () => {
        this.windowFocused = true;
        if (this.lastSeenMessage) {
          this.props.dispatch(messageSeen(this.lastSeenMessage));
          this.lastSeenMessage = null;
        }
      });
    }
  }

  componentDidMount() {
    const {thread} = this.props;
    if (thread) {
      if (thread.onTheFly) {
        return
      }
      if (thread.id) {
        this._fetchInitHistory();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const {messageNew: oldNewMessage, threadGoToMessageId: oldThreadGoToMessageId, threadMessages, dispatch, user} = this.props;
    const {messageNew, thread, threadGoToMessageId} = nextProps;
    const {hasNext} = threadMessages;

    if (threadGoToMessageId !== oldThreadGoToMessageId) {
      this.goToSpecificMessage(threadGoToMessageId);
      return false;
    }

    //Check for allow rendering
    if (!oldNewMessage && !messageNew) {
      return true;
    }
    if (oldNewMessage && messageNew) {
      if (oldNewMessage.uniqueId === messageNew.uniqueId) {
        if (!oldNewMessage.id && messageNew.id) {
          dispatch(threadNewMessage(messageNew));
        }
        return true;
      }
    }
    if (messageNew.threadId !== thread.id) {
      return true;
    }

    //functionality after allowing newMessage to come for calculation

    if (isMessageByMe(messageNew, user)) {
      if (hasNext) {
        dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
        return false;
      } else {
        dispatch(threadNewMessage(messageNew));
        this.gotoBottom = true;
        return false;
      }
    } else {
      if (this.scroller.current) {
        const scrollPositionInfo = this.scroller.current.getInfo();
        if (!hasNext) {
          dispatch(threadNewMessage(messageNew));
          if (scrollPositionInfo.isInBottomEnd) {
            this.gotoBottom = true;
            this.lastSeenMessage = messageNew;
          }
          return false;
        } else if (hasNext) {
          this.setState({
            newMessageUnreadCount: this.state.newMessageUnreadCount + 1
          });
          return false;
        }
      }
    }

    return true;
  }

  componentDidUpdate(oldProps) {
    const {thread, threadMessages, threadGetMessageListByMessageIdFetching, dispatch} = this.props;
    const {thread: oldThread} = oldProps;
    const {fetching} = threadMessages;
    const threadId = thread.id;

    if (!threadId) {
      return;
    }

    //If this thread is on the fly no need for history fetching
    if (thread.onTheFly) {
      return;
    }

    //If old thread was on the fly and we created an actual thread for that there is no need for history fetching or something else
    if (oldThread.onTheFly) {
      if (thread.participants) {
        if (thread.participants.filter(e => e.id === thread.partner)[0].coreUserId === oldThread.partner.coreUserId) {
          return;
        }
      }
    }

    //fetch message if thread change
    if (!oldThread || oldThread.id !== threadId) {
      return this._fetchInitHistory();
    }

    //scroll to message if have pending message to go
    if (fetching || threadGetMessageListByMessageIdFetching) {
      return;
    }

    if (this.lastSeenMessage) {
      if (this.lastSeenMessage.threadId === threadId) {
        if (this.windowFocused) {
          dispatch(messageSeen(this.lastSeenMessage));
          this.lastSeenMessage = null;
        }
      }
    }

    if (this.hasPendingMessageToGo) {
      return this.goToSpecificMessage(this.hasPendingMessageToGo);
    }

    if (this.gotoBottom && this.scroller.current) {
      this.scroller.current.gotoBottom();
      return this.gotoBottom = false;
    }
  }

  _fetchInitHistory() {
    this.lastSeenMessage = null;
    this.gotoBottom = false;
    this.hasPendingMessageToGo = null;
    const {thread, dispatch} = this.props;
    dispatch(threadMessageGetListPartial(null, null, null, null, true));
    dispatch(threadMessageGetListByMessageId(null, null, null, true));
    if (thread.unreadCount > statics.historyFetchCount) {
      this.hasPendingMessageToGo = thread.lastSeenMessageTime;
      this._fetchHistoryFromMiddle(thread.id, thread.lastSeenMessageTime);
      this.lastSeenMessage = thread.lastMessageVO;
    } else {
      if (thread.lastSeenMessageTime && thread.lastMessageVO) {
        if (thread.lastSeenMessageTime >= thread.lastMessageVO.time) {
          this.gotoBottom = true;
        } else if (thread.lastMessageVO.previousId === thread.lastSeenMessageId) {
          this.gotoBottom = true;
          this.hasPendingMessageToGo = thread.lastSeenMessageTime;
          this.lastSeenMessage = thread.lastMessageVO;
        } else {
          this.hasPendingMessageToGo = thread.lastSeenMessageTime;
          this.lastSeenMessage = thread.lastMessageVO;
        }
      } else {
        if (thread.lastMessageVO) {
          this.lastSeenMessage = thread.lastMessageVO;
        }
      }
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    }
  }

  _fetchHistoryFromMiddle(threadId, messageTime) {
    this.props.dispatch(threadMessageGetListByMessageId(threadId, messageTime, statics.historyFetchCount));
  }

  onGotoBottomClicked() {
    const {threadMessages, messageNew, thread} = this.props;
    const {hasNext} = threadMessages;
    if (hasNext) {
      this._fetchInitHistory();
    } else {
      if (thread.unreadCount) {
        this.lastSeenMessage = messageNew;
      }
      this.scroller.current.gotoBottom();
    }
    this.setState({
      bottomButtonShowing: false
    });
  }

  onScrollTopThreshold() {
    const {thread, threadMessages, dispatch} = this.props;
    const {messages} = threadMessages;
    dispatch(threadMessageGetListPartial(thread.id, messages[0].time - 200, false, statics.historyFetchCount));
  }

  onScrollBottomThreshold() {
    const {thread, threadMessages, dispatch} = this.props;
    const {messages} = threadMessages;
    dispatch(threadMessageGetListPartial(thread.id, messages[messages.length - 1].time + 200, true, statics.historyFetchCount));
  }

  onScrollBottomEnd() {
    const {thread, messageNew} = this.props;
    if (thread.unreadCount > 0) {
      this.lastSeenMessage = messageNew;
    }
    this.setState({
      bottomButtonShowing: false
    });
  }

  onScrollTop() {
    if (!this.state.bottomButtonShowing && !this.props.threadMessages.fetching) {
      this.setState({
        bottomButtonShowing: true
      });
    }
  }

  goToSpecificMessage(messageTime) {
    const {thread} = this.props;
    if (!this.scroller) {
      return;
    }
    if (!this.scroller.current) {
      return;
    }
    const result = this.scroller.current.gotoElement(`message-${messageTime}`);
    clearTimeout(this.highLighterTimeOut);
    const setHighlighter = () => {
      this.setState({
        highLightMessage: messageTime
      });
      this.highLighterTimeOut = setTimeout(() => {
        this.setState({
          highLightMessage: false
        });
      }, 2500);
    };

    if (!result) {

      //If last request was the same message and if this message is not exists in history fetch from init
      if (messageTime === this.hasPendingMessageToGo) {
        return this._fetchInitHistory();
      }

      this.lastFailedResultGotoMessageId = messageTime;
      this.hasPendingMessageToGo = messageTime;
      this._fetchHistoryFromMiddle(thread.id, messageTime);
      return setHighlighter();
    }
    setHighlighter();
    this.hasPendingMessageToGo = null;
  }

  onRepliedMessageClicked(time, isDeleted, e) {
    e.stopPropagation();
    if (isDeleted) {
      return;
    }
    this.goToSpecificMessage(time);
  }

  onAddToCheckedMessage(message, isAdd, e) {
    e.stopPropagation();
    if (!message.id) {
      return;
    }
    this.props.dispatch(threadCheckedMessageList(isAdd, message));
  }

  onAvatarClick(participant) {
    this.props.dispatch(threadCreateOnTheFly(participant.coreUserId, participant));
  }

  onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnter(e) {
    e.stopPropagation();
  }

  onFileDrop(e, notPrevent) {
    e.stopPropagation();
    if (!notPrevent) {
      e.preventDefault();
    }
    const dt = e.dataTransfer;
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
      this.props.dispatch(threadFilesToUpload(dt.files));
    }
    return false;
  }


  onPaste(e) {
    if (e.clipboardData) {
      e.dataTransfer = e.clipboardData;
      this.onFileDrop(e, true);
    }
  }

  render() {
    const {
      threadMessages,
      threadMessagesPartialFetching,
      threadGetMessageListByMessageIdFetching,
      user,
      thread,
      threadCheckedMessageList,
      threadSelectMessageShowing
    } = this.props;
    const {messages, fetching} = threadMessages;
    const {hasPrevious, hasNext} = threadMessages;
    const {highLightMessage, bottomButtonShowing} = this.state;
    const MainMessagesMessageContainerClassNames = message => classnames({
      [style.MainMessages__MessageContainer]: true,
      [style["MainMessages__MessageContainer--left"]]: !isMessageByMe(message, user, thread)
    });

    if (!thread.id || fetching || threadGetMessageListByMessageIdFetching) {
      return <LoadingFragment/>;
    }

    if (!messages.length) {
      return <NoMessageFragment/>;
    }

    const args = {
      thread,
      messages,
      user,
      highLightMessage,
      onRepliedMessageClicked: this.onRepliedMessageClicked,
      isMessageByMe,
      showNameOrAvatar
    };

    return (
      <Container className={style.MainMessages}
                 onDragEnter={this.onDragEnter}
                 onDragOver={this.onDragOver}
                 onDrop={this.onFileDrop}>
        {threadMessagesPartialFetching && <PartialLoadingFragment/>}
        <Scroller ref={this.scroller}
                  checkForSnapping
                  className={style.MainMessages__Messages}
                  threshold={5}
                  onScrollBottomEnd={this.onScrollBottomEnd}
                  onScrollBottomThreshold={this.onScrollBottomThreshold}
                  onScrollBottomThresholdCondition={hasNext && !threadMessagesPartialFetching && !threadGetMessageListByMessageIdFetching}
                  onScrollTop={this.onScrollTop}
                  onScrollTopThreshold={this.onScrollTopThreshold}
                  onScrollTopThresholdCondition={hasPrevious && !threadMessagesPartialFetching && !threadGetMessageListByMessageIdFetching}>
          <List>
            {messages.map(message =>
              <ListItem key={message.time}
                        data={message}
                        active={threadSelectMessageShowing && messageSelectedCondition(message, threadCheckedMessageList)}
                        activeColor="gray"
                        noPadding>
                <Container className={MainMessagesMessageContainerClassNames(message)}
                           id={`message-${message.time}`}
                           relative>
                  {thread.group && thread.type !== 8 && !isMessageByMe(message, user, thread) && getAvatar(message, messages, this.onAvatarClick, thread, user)}
                  <MainMessagesMessage {...args} message={message}/>
                  {threadSelectMessageShowing && messageTickFragment(message, this.onAddToCheckedMessage.bind(this), threadCheckedMessageList)}
                </Container>
              </ListItem>
            )}

          </List>
        </Scroller>
        {bottomButtonShowing && !this.gotoBottom ?
          <ButtonFloating onClick={this.onGotoBottomClicked} size="sm" position={{right: 0, bottom: 0}}>
            <MdExpandMore size={style.iconSizeMd} style={{margin: "0 5px"}}/>
          </ButtonFloating> :
          ""}
      </Container>
    )
  }
}