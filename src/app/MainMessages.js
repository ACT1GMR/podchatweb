// src/list/BoxSceneMessages
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import {avatarNameGenerator, OnWindowFocusInOut, mobileCheck} from "../utils/helpers";

//strings
import strings from "../constants/localization";

//actions
import {messageSeen} from "../actions/messageActions";
import {
  threadMessageGetListByMessageId,
  threadMessageGetListPartial,
  threadMessageGetList,
  threadUnreadMentionedMessageGetList,
  threadCheckedMessageList,
  threadNewMessage,
  threadFilesToUpload,
  threadCreateOnTheFly, threadUnreadMentionedMessageRemove
} from "../actions/threadActions";

//components
import {ButtonFloating} from "../../../uikit/src/button";
import List, {ListItem} from "../../../uikit/src/list";
import Avatar, {AvatarImage} from "../../../uikit/src/avatar";
import Loading, {LoadingBlinkDots} from "../../../uikit/src/loading";
import Container from "../../../uikit/src/container";
import Message from "../../../uikit/src/message";
import Scroller from "../../../uikit/src/scroller";

//styling
import {
  MdChatBubbleOutline,
  MdExpandMore,
} from "react-icons/md";
import style from "../../styles/pages/box/MainMessages.scss";
import styleVar from "../../styles/variables.scss";
import MainMessagesMessage from "./MainMessagesMessage";
import MainPinMessage from "./MainPinMessage";
import Shape, {ShapeCircle} from "../../../uikit/src/shape";
import {ContextTrigger} from "../../../uikit/src/menu/Context";
import MainMessagesUnreadBar from "./MainMessagesUnreadBar";

const statics = {
  historyFetchCount: 20,
  historyUnseenMentionedFetchCount: 100,
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
    threadUnreadMentionedMessages: store.threadUnreadMentionedMessages,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    threadGetMessageListByMessageIdFetching: store.threadGetMessageListByMessageId.fetching,
    threadSelectMessageShowing: store.threadSelectMessageShowing,
    threadCheckedMessageList: store.threadCheckedMessageList,
    threadGoToMessageId: store.threadGoToMessageId,
    messageNew: store.messageNew,
    user: store.user.user,
  };
}, null, null, {withRef: true})
export default class MainMessages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bottomButtonShowing: false,
      highLightMessage: null,
      unreadBar: null,
      newMessageUnreadCount: 0,
      threadUnreadMentionedMessagesCount: 0
    };
    this.scroller = React.createRef();
    this.onScrollBottomEnd = this.onScrollBottomEnd.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onRepliedMessageClicked = this.onRepliedMessageClicked.bind(this);
    this.onScrollTopThreshold = this.onScrollTopThreshold.bind(this);
    this.onScrollTop = this.onScrollTop.bind(this);
    this.onGotoBottomClicked = this.onGotoBottomClicked.bind(this);
    this.onMentionedClicked = this.onMentionedClicked.bind(this);
    this.onAvatarClick = this.onAvatarClick.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.goToSpecificMessage = this.goToSpecificMessage.bind(this);
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
        return;
      }
      if (thread.id) {
        if (thread.mentioned) {
          this.fetchUnreadMentionedMessages();
        }
        this._fetchInitHistory();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const {messageNew: oldNewMessage, threadGoToMessageId: oldThreadGoToMessageId, threadMessages, threadUnreadMentionedMessages, dispatch, user} = this.props;
    const {messageNew, thread, threadGoToMessageId, threadUnreadMentionedMessages: newThreadUnreadMentionedMessages} = nextProps;
    const {hasNext} = threadMessages;

    if (threadGoToMessageId !== oldThreadGoToMessageId) {
      this.goToSpecificMessage(threadGoToMessageId);
      return false;
    }

    //Unread mentioned message fetched here and we need to update threadUnreadMentionedMessagesCount
    //update UI is not required
    if (!newThreadUnreadMentionedMessages.fetching) {
      if (threadUnreadMentionedMessages.messages.length !== newThreadUnreadMentionedMessages.messages.length) {
        this.setState({
          threadUnreadMentionedMessagesCount: newThreadUnreadMentionedMessages.messages.length
        });
        return false;
      }
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
      this.setState({unreadBar: null});
      if (hasNext) {
        dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
        this.gotoBottom = true;
        return false;
      } else {
        dispatch(threadNewMessage(messageNew));
        this.gotoBottom = true;
        return false;
      }
    } else {
      if (!window.windowFocused) {
        const {unreadBar} = this.state;
        if (thread.lastSeenMessageTime !== unreadBar) {
          this.setState({unreadBar: thread.lastSeenMessageTime});
        }
      }
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
    const {thread, threadMessages, threadGetMessageListByMessageIdFetching, threadUnreadMentionedMessages, dispatch} = this.props;
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
      if (thread.mentioned) {
        this.fetchUnreadMentionedMessages();
      } else if (threadUnreadMentionedMessages.messages.length) {
        this.fetchUnreadMentionedMessages(true);
      }
      return this._fetchInitHistory();
    }

    //scroll to message if have pending message to go
    if (fetching || threadGetMessageListByMessageIdFetching) {
      return;
    }

    if (this.lastSeenMessage) {
      if (this.windowFocused) {
        dispatch(messageSeen(this.lastSeenMessage));
        this.lastSeenMessage = null;
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
      this.setState({unreadBar: thread.lastSeenMessageTime});
      this.lastSeenMessage = thread.lastMessageVO;
    } else {
      let unreadBar = null;
      if (thread.lastSeenMessageTime && thread.lastMessageVO) {
        if (thread.lastSeenMessageTime >= thread.lastMessageVO.time) {
          this.gotoBottom = true;
        } else if (thread.lastMessageVO.previousId === thread.lastSeenMessageId) {
          this.gotoBottom = true;
          unreadBar = this.hasPendingMessageToGo = thread.lastSeenMessageTime;
          this.lastSeenMessage = thread.lastMessageVO;
        } else {
          unreadBar = this.hasPendingMessageToGo = thread.lastSeenMessageTime;
          this.lastSeenMessage = thread.lastMessageVO;
        }
      } else {
        if (thread.lastMessageVO) {
          this.lastSeenMessage = thread.lastMessageVO;
        }
      }
      this.setState({unreadBar});
      dispatch(threadMessageGetList(thread.id, statics.historyFetchCount));
    }
  }

  fetchUnreadMentionedMessages(canceled) {
    const {dispatch, thread} = this.props;
    if (canceled) {
      return dispatch(threadUnreadMentionedMessageGetList());
    }
    dispatch(threadUnreadMentionedMessageGetList(thread.id, statics.historyUnseenMentionedFetchCount));
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

  onMentionedClicked() {
    const {threadUnreadMentionedMessages, dispatch} = this.props;
    const {threadUnreadMentionedMessagesCount} = this.state;
    const {messages} = threadUnreadMentionedMessages;
    const firstUnreadMessage = messages[0];
    this.goToSpecificMessage(firstUnreadMessage.time);
    this.setState({
      threadUnreadMentionedMessagesCount: threadUnreadMentionedMessagesCount - 1
    });
    dispatch(threadUnreadMentionedMessageRemove(firstUnreadMessage.id));
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
    if (messageNew) {
      if (thread.id === messageNew.threadId) {
        if (thread.unreadCount > 0) {
          this.lastSeenMessage = messageNew;
        }
      }
    }

    this.setState({
      bottomButtonShowing: false
    });
  }

  onScrollTop() {
    if (!this.state.bottomButtonShowing && !this.props.threadMessages.fetching) {
      const {scrollPosition, scrollHeight} = this.scroller.current.getInfo();
      if (scrollHeight - scrollPosition > 70) {
        this.setState({
          bottomButtonShowing: true
        });
      }
    }
  }

  goToSpecificMessage(messageTime) {
    const {thread, threadMessages} = this.props;
    const {bottomButtonShowing, unreadBar} = this.state;
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

      this.hasPendingMessageToGo = messageTime;
      this._fetchHistoryFromMiddle(thread.id, messageTime);
      return this.setState({unreadBar: null});
    }
    if (unreadBar !== messageTime) {
      setHighlighter();
    }
    if (threadMessages.hasNext) {
      if (!bottomButtonShowing) {
        this.setState({
          bottomButtonShowing: true
        });
      }
    }
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
    const {highLightMessage, bottomButtonShowing, threadUnreadMentionedMessagesCount, unreadBar} = this.state;
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
                {
                  unreadBar === message.time && <MainMessagesUnreadBar thread={thread}/>
                }
              </ListItem>
            )}

          </List>

        </Scroller>
        {bottomButtonShowing && !this.gotoBottom &&
        <ButtonFloating onClick={this.onGotoBottomClicked} size="sm" position={{right: 0, bottom: 0}}>
          <MdExpandMore size={style.iconSizeMd}/>
        </ButtonFloating>}
        {threadUnreadMentionedMessagesCount > 0 &&
        <ButtonFloating onClick={this.onMentionedClicked} size="sm"
                        position={{right: 0, bottom: bottomButtonShowing && !this.gotoBottom ? 45 : 0}}>
          <Container className={style.MainMessages__MentionedButtonContainer}>
            <Shape color="accent">
              <ShapeCircle>{threadUnreadMentionedMessagesCount}</ShapeCircle>
            </Shape>
          </Container>
          @
        </ButtonFloating>}
      </Container>
    )
  }
}