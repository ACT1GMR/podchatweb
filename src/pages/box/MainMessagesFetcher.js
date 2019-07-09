// src/list/BoxSceneMessages
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import date from "../../utils/date";
import {avatarNameGenerator} from "../../utils/helpers";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen} from "../../actions/messageActions";
import {
  threadMessageGetListByMessageId,
  threadMessageGetListPartial,
  threadMessageGetList,
  threadCheckedMessageList,
  threadLeftAsideShowing, threadNewMessage, threadCreate
} from "../../actions/threadActions";

//components
import {ButtonFloating} from "../../../../uikit/src/button"
import List, {ListItem} from "../../../../uikit/src/list"
import Avatar, {AvatarImage} from "../../../../uikit/src/avatar";
import Loading, {LoadingBlinkDots} from "../../../../uikit/src/loading";
import Paper, {PaperFooter} from "../../../../uikit/src/paper";
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
  MdInsertDriveFile, MdExpandLess
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessages.scss";
import styleVar from "./../../../styles/variables.scss";
import {THREAD_LEFT_ASIDE_SEEN_LIST} from "../../constants/actionTypes";

const statics = {
  historyFetchCount: 20,
};

function isMessageByMe(message, user) {
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

export function isFile(message) {
  if (message) {
    if (message.metadata) {
      if (typeof message.metadata === "object") {
        return message.metadata.file;
      }
      return JSON.parse(message.metadata).file;
    }
  }
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

function datePetrification(time) {
  const correctTime = time / Math.pow(10, 6);
  return date.isToday(correctTime) ? date.format(correctTime, "HH:mm") : date.isWithinAWeek(correctTime) ? date.format(correctTime, "dddd HH:mm") : date.format(correctTime, "YYYY-MM-DD  HH:mm");
}

function personNameFragment(message, messages, user) {
  const messageParticipant = message.participant;
  const color = avatarNameGenerator(messageParticipant.name).color;
  return showNameOrAvatar(message, messages) &&
    <Text size="sm" bold
          style={{color: color}}>{isMessageByMe(message, user) ? messageParticipant.name : messageParticipant.contactName || messageParticipant.name}</Text>
}

function forwardFragment(message) {
  const forwardInfo = message.forwardInfo;
  if (forwardInfo) {
    const participant = forwardInfo.participant;
    return (
      <Container>
        <Paper colorBackground style={{borderRadius: "5px"}}>
          <Text italic size="xs">{strings.forwardFrom}</Text>
          <Text bold>{participant.contactName || participant.name}:</Text>
        </Paper>
        <Gap block y={5}/>
      </Container>
    )
  }
  return "";
}


function replyFragment(message, gotoMessageFunc) {
  if (message.replyInfo) {
    const replyInfo = message.replyInfo;
    let meta = "";
    try {
      meta = JSON.parse(replyInfo.metadata);
    } catch (e) {
    }
    const text = replyInfo.message;
    const file = meta && meta.file;
    let isImage, isVideo, imageLink;
    if (file) {
      isImage = file.mimeType.indexOf("image") > -1;
      isVideo = file.mimeType.indexOf("video") > -1;
      if (isImage) {
        let width = file.width;
        let height = file.height;
        const ratio = height / width;
        const maxWidth = 100;
        height = Math.ceil(maxWidth * ratio);
        imageLink = `${file.link}&width=${maxWidth}&height=${height}`;
      }
    }
    const imageLinkString = `url(${imageLink})`;
    return (
      <Container
        cursor="pointer"
        onClick={gotoMessageFunc.bind(null, replyInfo.repliedToMessageTime, replyInfo.deleted)}>
        <Paper colorBackground
               style={{borderRadius: "5px", maxHeight: "70px", overflow: "hidden", position: "relative"}}>
          <Text bold size="xs">{strings.replyTo}:</Text>
          {isImage && text ?
            <Text italic size="xs" isHTML>{text && text.slice(0, 25)}</Text>
            :
            isImage && !text ?
              <Container>
                <MdCameraAlt size={style.iconSizeSm} color={style.colorGrayDark} style={{margin: "0 5px"}}/>
                <Text inline size="sm" bold color="gray" dark>{strings.photo}</Text>
              </Container> :
              isVideo ?
                <Container>
                  <MdVideocam size={style.iconSizeSm} color={style.colorGrayDark} style={{margin: "0 5px"}}/>
                  <Text inline size="sm" bold color="gray" dark>{strings.video}</Text>
                </Container> :
                file ?
                  <Container>
                    <MdInsertDriveFile size={style.iconSizeSm} color={style.colorGrayDark}
                                       style={{margin: "0 5px"}}/>
                    <Text inline size="sm" bold color="gray" dark>{file.originalName}</Text>
                  </Container>
                  :
                  <Text italic size="xs" isHTML>{text}</Text>}

          {isImage &&
          <Container className={style.MainMessages__ReplyFragmentImage}
                     style={{backgroundImage: imageLinkString}}/>
          }
        </Paper>
        <Gap block y={5}/>
      </Container>
    )
  }
  return "";
}

function seenFragment(message, user, thread, messageSeenListClick, onRetry, onCancel) {
  if (!isMessageByMe(message, user)) {
    return null;
  }
  if (message.hasError) {
    return (
      <Container inline>
        <MdErrorOutline size={style.iconSizeXs} style={{margin: "0 5px"}}/>
        <Gap x={2}>
          <Container onClick={onRetry} inline>
            <Text size="xs" color="accent" linkStyle>{strings.tryAgain}</Text>
          </Container>
          <Gap x={5}/>
          <Container onClick={onCancel} inline>
            <Text size="xs" color="accent" linkStyle>{strings.cancel}</Text>
          </Container>
        </Gap>
        <Gap x={3}/>
      </Container>
    )
  }
  const isGroup = thread.group;
  if (!message.id) {
    return <MdSchedule size={style.iconSizeXs} style={{margin: "0 5px"}}/>
  }
  if (!isGroup) {
    if (message.seen) {
      return <MdDoneAll size={style.iconSizeXs} style={{margin: "0 5px"}}/>
    }
  }
  return <MdDone className={isGroup ? style.MainMessages__SentIcon : ""} size={style.iconSizeXs}
                 style={{margin: "0 5px", cursor: isGroup ? "pointer" : "default"}}
                 onClick={isGroup ? messageSeenListClick : null}/>
}

function editFragment(message) {
  if (message.edited) {
    return (
      <Gap x={2}>
        <Text italic size="xs" inline>{strings.edited}</Text>
      </Gap>
    )
  }
}

function highLighterFragment(message, highLightMessage) {
  const classNames = classnames({
    [style.MainMessages__Highlighter]: true,
    [style["MainMessages__Highlighter--highlighted"]]: highLightMessage && highLightMessage === message.time
  });
  return (
    <Container className={classNames}>
      <Container className={style.MainMessages__HighlighterBox}/>
    </Container>
  );
}

function noMessageFragment() {
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

function loadingFragment() {
  return (
    <Container className={style.MainMessages}>
      <Container center centerTextAlign style={{width: "100%"}}>
        <Loading hasSpace><LoadingBlinkDots/></Loading>
      </Container>
    </Container>
  )
}

function PaperFragment(message, messages, user, gotoMessageFunc, {children}) {
  return (
    <Paper style={{borderRadius: "5px"}} hasShadow colorBackgroundLight>
      {personNameFragment(message, messages, user)}
      {replyFragment(message, gotoMessageFunc)}
      {forwardFragment(message)}
      {children}
    </Paper>
  )
}

function PaperFragmentFooter(message, {children}) {
  return (
    <PaperFooter>
      {children}
      {datePetrification(message.time)}
      <Container inline left inSpace
                 className={style.MainMessages__OpenTriggerIconContainer}>
        <MdExpandLess size={styleVar.iconSizeMd}
                      className={style.MainMessages__TriggerIcon}
                      onClick={this.onMessageControlShow.bind(this)}/>
      </Container>
    </PaperFooter>
  );
}

function messageTickFragment(message, onAddToCheckedMessage, threadCheckedMessageList) {
  const isExisted = messageSelectedCondition(message, threadCheckedMessageList);
  const classNames = classnames({
    [style.MainMessages__Tick]: true,
    [style["MainMessages__Tick--selected"]]: isExisted
  });
  return <Container className={classNames} onClick={onAddToCheckedMessage.bind(null, message, !isExisted)}/>;
}

function getMessage(message, messages, user, gotoMessageFunc, highLightMessage, thread, messageSeenListClick) {
  const args = {
    highLighterFragment: highLighterFragment.bind(null, message, highLightMessage),
    seenFragment: seenFragment.bind(null, message, user, thread, messageSeenListClick),
    editFragment: editFragment.bind(null, message),
    PaperFragment: PaperFragment.bind(null, message, messages, user, gotoMessageFunc),
    PaperFooterFragment: PaperFragmentFooter.bind(null, message),
    isMessageByMe: isMessageByMe.bind(null, message, user),
    isFirstMessage: showNameOrAvatar(message, messages),
    datePetrification: datePetrification.bind(null, message.time),
    message,
    user
  };
  return isFile(message) ?
    <MainMessagesFile {...args}/>
    :
    <MainMessagesText {...args}/>;
}

function getAvatar(message, messages, onAvatarClick, thread, user) {
  const showAvatar = showNameOrAvatar(message, messages);
  const enableClickCondition = !isMessageByMe(message, user) && thread.group;
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

    //Controller fields
    this.gotoBottom = false;
    this.hasPendingMessageToGo = null;
    this.lastSeenMessage = null;
  }

  componentDidMount() {
    const {thread} = this.props;
    if (thread) {
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
      this.hasPendingMessageToGo = threadGoToMessageId;
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
    if (this.scroller.current) {
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
        const scrollPositionInfo = this.scroller.current.getInfo();
        if (!hasNext && scrollPositionInfo.isInBottomEnd) {
          dispatch(threadNewMessage(messageNew));
          this.gotoBottom = true;
          this.lastSeenMessage = messageNew;
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

    //fetch message if thread change
    if (!oldThread || oldThread.id !== threadId) {
      return this._fetchInitHistory();
    }

    //scroll to message if have pending message to go
    if (fetching || threadGetMessageListByMessageIdFetching) {
      return;
    }

    if (this.lastSeenMessage) {
      dispatch(messageSeen(this.lastSeenMessage));
      this.lastSeenMessage = null;
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
    const {thread, dispatch} = this.props;
    const result = this.scroller.current.gotoElement(`message-${messageTime}`);
    const setHighlighter = () => {
      this.setState({
        highLightMessage: messageTime
      });
      setTimeout(() => {
        this.setState({
          highLightMessage: false
        });
      }, 2500);
    };

    if (!result) {
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

  onMessageSeenListClick(message, e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEEN_LIST, message.id));
  }

  onAddToCheckedMessage(message, isAdd, e) {
    e.stopPropagation();
    this.props.dispatch(threadCheckedMessageList(isAdd, message));
  }

  onAvatarClick(participant) {
    this.props.dispatch(threadCreate(participant.id, null, null, "TO_BE_USER_ID"));
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
      [style["MainMessages__MessageContainer--left"]]: !isMessageByMe(message, user)
    });

    if (!thread.id || fetching || threadGetMessageListByMessageIdFetching) {
      return loadingFragment();
    }

    if (!messages.length) {
      return noMessageFragment();
    }

    return (
      <Container className={style.MainMessages}>
        <Scroller ref={this.scroller}
                  threshold={10}
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
                  {getAvatar(message, messages, this.onAvatarClick, thread, user)}
                  {getMessage(message, messages, user, this.onRepliedMessageClicked.bind(this), highLightMessage, thread, this.onMessageSeenListClick.bind(this, message))}
                  {threadSelectMessageShowing && messageTickFragment(message, this.onAddToCheckedMessage.bind(this), threadCheckedMessageList)}
                </Container>
              </ListItem>
            )}

          </List>
        </Scroller>
        {bottomButtonShowing ?
          <ButtonFloating onClick={this.onGotoBottomClicked} size="sm" position={{right: 0, bottom: 0}}>
            <MdExpandMore size={style.iconSizeMd} style={{margin: "0 5px"}}/>
          </ButtonFloating> :
          ""}
      </Container>
    )
  }
}