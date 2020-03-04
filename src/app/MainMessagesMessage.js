// src/list/BoxSceneMessages
import React, {Component, Fragment} from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import {isMessageByMe} from "./MainMessages"
import date from "../utils/date";

import {showBlock} from "./MainFooterSpam";
import MainMessagesMessageFile from "./MainMessagesMessageFile";
import MainMessagesMessageText from "./MainMessagesMessageText";
import {MessageDeletePrompt, PinMessagePrompt} from "./_component/prompts";
import {isOwner} from "./ModalThreadInfoGroupMain";

//strings
import strings from "../constants/localization";

//actions
import {
  threadLeftAsideShowing, threadMessagePinToTop, threadModalListShowing
} from "../actions/threadActions";

//components
import Context, {ContextItem, ContextTrigger} from "../../../uikit/src/menu/Context";
import Paper, {PaperFooter} from "../../../uikit/src/paper";
import Container from "../../../uikit/src/container";
import {Text} from "../../../uikit/src/typography";
import Gap from "../../../uikit/src/gap";

//styling
import {
  MdDoneAll,
  MdVideocam,
  MdDone,
  MdErrorOutline,
  MdSchedule,
  MdCameraAlt,
  MdInsertDriveFile,
  MdExpandLess,
  MdReply,
  MdArrowBack,
  MdDelete,
  MdInfo
} from "react-icons/md";
import {
  TiArrowForward
} from "react-icons/ti";
import {
  AiFillPushpin
} from "react-icons/ai";
import style from "../../styles/pages/box/MainMessagesMessage.scss";
import styleVar from "../../styles/variables.scss";
import {THREAD_LEFT_ASIDE_SEEN_LIST} from "../constants/actionTypes";
import {avatarNameGenerator, mobileCheck} from "../utils/helpers";
import {messageEditing} from "../actions/messageActions";
import {chatModalPrompt} from "../actions/chatActions";
import {decodeEmoji} from "./MainFooterEmojiIcons";

function datePetrification(time) {
  const correctTime = time / Math.pow(10, 6);
  return date.isToday(correctTime) ? date.format(correctTime, "HH:mm") : date.isWithinAWeek(correctTime) ? date.format(correctTime, "dddd HH:mm") : date.format(correctTime, "YYYY-MM-DD  HH:mm");
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

export function ForwardFragment(message, isMessageByMe) {
  const forwardInfo = message.forwardInfo;
  if (forwardInfo) {
    const participant = forwardInfo.participant;
    const inlineStyle = {
      borderRadius: "5px"
    };
    if (isMessageByMe) {
      inlineStyle.backgroundColor = "#dee8d2";
    }
    const name = !participant ? forwardInfo.conversation.title : participant && (participant.contactName || participant.name);
    return (
      <Container>
        <Paper colorBackground style={inlineStyle}>
          <Text italic size="xs">{strings.forwardFrom}</Text>
          <Text bold>{name}:</Text>
        </Paper>
        <Gap block y={5}/>
      </Container>
    )
  }
  return null;
}


export function PersonNameFragment(message, isFirstMessage, isMessageByMe) {
  const messageParticipant = message.participant;
  const color = avatarNameGenerator(messageParticipant.name).color;
  return isFirstMessage &&
    <Text size="sm" bold
          style={{color: color}}>{isMessageByMe ? messageParticipant.name : messageParticipant.contactName || messageParticipant.name}</Text>
}

export function ReplyFragment(isMessageByMe, message, gotoMessageFunc) {
  if (message.replyInfo) {
    const replyInfo = message.replyInfo;
    let meta = "";
    try {
      meta = JSON.parse(replyInfo.metadata);
    } catch (e) {
    }
    const text = decodeEmoji(replyInfo.message);
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
    const inlineStyle = {
      borderRadius: "5px", maxHeight: "70px", overflow: "hidden", position: "relative"
    };
    if (isMessageByMe) {
      inlineStyle.backgroundColor = "#dee8d2";
    }
    return (
      <Container
        cursor={replyInfo.deleted ? "default" : "pointer"}
        onClick={gotoMessageFunc.bind(null, replyInfo.repliedToMessageTime, replyInfo.deleted)}>
        <Paper colorBackground
               style={inlineStyle}>
          <Text bold size="xs">{strings.replyTo}:</Text>
          {replyInfo.deleted ?
            <Text bold size="xs" italic color="gray" dark>{strings.messageDeleted}</Text>
            :
            <Container>
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
              <Container className={style.MainMessagesMessage__ReplyFragmentImage}
                         style={{backgroundImage: imageLinkString}}/>
              }

            </Container>

          }
        </Paper>
        <Gap block y={5}/>
      </Container>
    )
  }
  return "";
}

export function SeenFragment({isMessageByMe, message, thread, onMessageSeenListClick, onRetry, onCancel, forceSeen}) {
  if (!isMessageByMe) {
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
  const messageStatusIconSpecs = {
    color: styleVar.colorGreenTick,
    size: 18,
    style: {margin: "0 5px"}
  };
  if (!message.id) {
    return <MdSchedule size={messageStatusIconSpecs.size} style={messageStatusIconSpecs.style}
                       color={messageStatusIconSpecs.color}/>
  }
  if (!isGroup) {
    if (message.seen || forceSeen) {
      return <MdDoneAll size={messageStatusIconSpecs.size} style={messageStatusIconSpecs.style}
                        color={messageStatusIconSpecs.color}/>
    }
  }
  return <MdDone className={isGroup ? style.MainMessagesMessage__SentIcon : ""}
                 size={messageStatusIconSpecs.size}
                 color={messageStatusIconSpecs.color}
                 style={{margin: "0 5px", cursor: isGroup ? "pointer" : "default"}}
                 onClick={isGroup ? onMessageSeenListClick : null}/>
}

export function EditFragment({message}) {
  if (message.edited) {
    return (
      <Gap x={2}>
        <Text italic size="xs" inline>{strings.edited}</Text>
      </Gap>
    )
  }
  return "";
}

export function HighLighterFragment({message, highLightMessage}) {
  const classNames = classnames({
    [style.MainMessagesMessage__Highlighter]: true,
    [style["MainMessagesMessage__Highlighter--highlighted"]]: highLightMessage && highLightMessage === message.time
  });
  return (
    <Container className={classNames}>
      <Container className={style.MainMessagesMessage__HighlighterBox}/>
    </Container>
  );
}

export function PaperFragment({message, onRepliedMessageClicked, isFirstMessage, isMessageByMe, isGroup, children}) {
  const style = {
    borderRadius: "5px"
  };
  if (isMessageByMe) {
    style.backgroundColor = "#effdde";
  }
  return (
    <Paper style={style} hasShadow colorBackgroundLight={!isMessageByMe} relative>
      {isGroup && PersonNameFragment(message, isFirstMessage, isMessageByMe)}
      {ReplyFragment(isMessageByMe, message, onRepliedMessageClicked)}
      {ForwardFragment(message, isMessageByMe)}
      {children}
    </Paper>
  )
}

export function PaperFooterFragment({message, messageTriggerShow, isMessageByMe, children}) {
  const classNames = classnames({
    [style.MainMessagesMessage__OpenTriggerIconContainer]: true,
    [style["MainMessagesMessage__OpenTriggerIconContainer--show"]]: message.id && messageTriggerShow,
  });
  const inlineStyle = {};
  if (isMessageByMe) {
    inlineStyle.color = "#8e9881"
  }
  return (
    <PaperFooter style={inlineStyle}>
      {children}
      {datePetrification(message.time)}
      <Container bottomLeft className={classNames}>
        <ContextTrigger id={message.id} holdToDisplay={mobileCheck() ? 1000 : -1} mouseButton={0}>

          <MdExpandLess size={styleVar.iconSizeMd}
                        style={{marginLeft: "10px"}}
                        id={message.id}
                        className={style.MainMessagesMessage__TriggerIcon}/>

        </ContextTrigger>
      </Container>
    </PaperFooter>
  );
}

/**
 * @return {string}
 */
export function ControlFragment({isMessageByMe, isParticipantBlocked, message, onDelete, onForward, onReply, onMessageSeenListClick, children, isChannel, isGroup, onPin, isOwner}) {
  const isMobile = mobileCheck();
  const deleteCondition = (!isChannel || (isChannel && isMessageByMe));
  const replyCondition = ((!isChannel && !isParticipantBlocked) || (isChannel && isMessageByMe));
  const pinToTopCondition = isOwner && (isGroup || isChannel);
  const messageInfoCondition = isMessageByMe && (isGroup || isChannel );
  const MobileContextMenu = () => {
    return <Fragment>
      <Container className={style.MainMessagesMessage__MenuActionContainer}>
        {
          deleteCondition &&
          <ContextItem onClick={onDelete}>
            <MdDelete size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
          </ContextItem>
        }

        <ContextItem onClick={onForward}>
          <TiArrowForward size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
        </ContextItem>

        {
          replyCondition &&
          <ContextItem onClick={onReply}>
            <MdReply size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
          </ContextItem>
        }

        {
          pinToTopCondition &&
          <ContextItem onClick={onPin}>
            <AiFillPushpin size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
          </ContextItem>
        }

        {
          messageInfoCondition &&
          <ContextItem onClick={onMessageSeenListClick}>
            <MdInfo size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
          </ContextItem>
        }

        {
          children
        }
      </Container>

      <ContextItem className={style.MainMessagesMessage__MobileMenuBack}>
        <MdArrowBack size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
      </ContextItem>
    </Fragment>
  };
  return <Context id={message.id} preventHideOnScroll={false} rtl stickyHeader={mobileCheck()}
                  style={mobileCheck() ? {height: "59px"} : null}>
    {isMobile ? <MobileContextMenu/> :
      <Fragment>
        {
          deleteCondition &&
          <ContextItem onClick={onDelete}>
            {strings.remove}
          </ContextItem>
        }

        <ContextItem onClick={onForward}>
          {strings.forward}
        </ContextItem>

        {
          replyCondition &&
          <ContextItem onClick={onReply}>
            {strings.reply}
          </ContextItem>
        }

        {
          pinToTopCondition &&
          <ContextItem onClick={onPin}>
            {strings.pinToTop}
          </ContextItem>
        }

        {
          messageInfoCondition &&
          <ContextItem onClick={onMessageSeenListClick}>
            {strings.messageInfo}
          </ContextItem>
        }

        {
          children
        }
      </Fragment>
    }
  </Context>
}

export function deleteForAllCondition(message, user, thread) {
  return message.deletable &&( (isMessageByMe(message, user)) || (thread.group && thread.inviter.id === user.id));
}

@connect(store => {
  return {
    participants: store.threadParticipantList.participants,
    participantsFetching: store.threadParticipantList.fetching,
    threadLeftAsideShowing: store.threadLeftAsideShowing
  };
})
export default class MainMessagesMessage extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onForward = this.onForward.bind(this);
    this.onReply = this.onReply.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onMessageControlHide = this.onMessageControlHide.bind(this);
    this.onMessageControlShow = this.onMessageControlShow.bind(this);
    this.onMessageSeenListClick = this.onMessageSeenListClick.bind(this);
    this.containerRef = React.createRef();
    this.contextTriggerRef = React.createRef();
    this.state = {
      messageControlShow: false,
      messageTriggerShow: false
    };
  }

  onMessageSeenListClick(e) {
    const {message, dispatch} = this.props;
    e.stopPropagation();
    dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEEN_LIST, message.id));
  }

  onMouseOver() {
    if (mobileCheck()) {
      return;
    }
    if (this.state.messageTriggerShow) {
      return;
    }
    this.setState({
      messageTriggerShow: true
    });
  }

  onMouseLeave() {
    if (!this.state.messageTriggerShow) {
      return;
    }
    this.setState({
      messageTriggerShow: false
    });
  }

  onMessageControlHide(e) {
    if (!this.state.messageControlShow) {
      return;
    }
    if (e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }
    this.setState({
      messageControlShow: false
    });
  }

  onMessageInfo() {

  }

  onMessageControlShow(e) {
    if (!this.state.messageControlShow) {
      this.setState({
        messageControlShow: true
      });
      return true;
    }
  }

  onPin() {
    const {dispatch, message} = this.props;
    dispatch(chatModalPrompt(true,
      null, null, null, null,
      <PinMessagePrompt message={message} dispatch={dispatch}/>));
  }

  onDelete(e) {
    const {dispatch, message, user, thread} = this.props;
    dispatch(chatModalPrompt(true,
      null, null, null, null,
      <MessageDeletePrompt thread={thread} message={message} dispatch={dispatch} user={user}/>));
    this.onMessageControlHide();
  }

  onForward() {
    const {dispatch, message} = this.props;
    dispatch(threadModalListShowing(true, message));
    this.onMessageControlHide && this.onMessageControlHide();
  }

  onReply() {
    const {dispatch, message} = this.props;
    dispatch(messageEditing(message, "REPLYING"));
    this.onMessageControlHide && this.onMessageControlHide();
  }

  onThreadTouchStart(message, e) {
    e.stopPropagation();
    const touchPosition = this.touchPosition;
    clearTimeout(this.showMenuTimeOutId);
    this.showMenuTimeOutId = setTimeout(() => {
      clearTimeout(this.showMenuTimeOutId);
      this.showMenuTimeOutId = null;
      if (this.touchPosition === touchPosition) {
        this.setState({
          isMenuShow: message.id
        });
          this.contextTriggerRef.current.handleContextClick(e);
      }
    }, 700);
  }

  onThreadTouchMove(message, e) {
    this.touchPosition = `${e.touches[0].pageX}${e.touches[0].pageY}`;
  }

  onThreadTouchEnd(message, e) {
    if (this.showMenuTimeOutId) {
      clearTimeout(this.showMenuTimeOutId);
    } else {
      e.preventDefault();
    }
  }

  render() {
    const {
      message,
      messages,
      user,
      thread,
      highLightMessage,
      showNameOrAvatar,
      onRepliedMessageClicked,
      isMessageByMe,
      participantsFetching,
      participants,
      threadLeftAsideShowing
    } = this.props;
    const {messageControlShow, messageTriggerShow} = this.state;
    const isGroup = thread.group && thread.type !== 8;
    const isMessageByMeReal = isMessageByMe(message, user, thread);
    const args = {
      //new paradigm
      onMessageControlShow: this.onMessageControlShow,
      onMessageSeenListClick: this.onMessageSeenListClick,
      onMessageControlHide: this.onMessageControlHide,
      onRepliedMessageClicked: onRepliedMessageClicked,
      onDelete: this.onDelete,
      onForward: this.onForward,
      onReply: this.onReply,
      onPin: this.onPin,
      isFirstMessage: showNameOrAvatar(message, messages),
      datePetrification: datePetrification.bind(null, message.time),
      messageControlShow,
      messageTriggerShow,
      forceSeen: messages && messages.length && messages[messages.length - 1].seen,
      isChannel: thread.group && thread.type === 8,
      isMessageByMe: isMessageByMeReal,
      isParticipantBlocked: showBlock({user, thread, participantsFetching, participants}),
      isOwner: isOwner(thread, user),
      user,
      thread,
      message,
      isGroup,
      messages,
      highLightMessage
    };
    return (
      <Container id={message.uuid}
                 userSelect="none"
                 inline relative
                 style={{
                   padding: "2px 5px",
                   minWidth: "175px",
                   maxWidth: mobileCheck() ? "70%" : threadLeftAsideShowing && window.innerWidth < 1100 ? "60%" : "50%",
                   marginRight: isGroup ? null : isMessageByMeReal ? "5px" : null,
                   marginLeft: isGroup ? null : isMessageByMeReal ? null : "5px"
                 }}
                 ref={this.containerRef}
                 onClick={this.onMessageControlShow.bind(this, true)}
                 onTouchStart={this.onThreadTouchStart.bind(this, message)}
                 onTouchMove={this.onThreadTouchMove.bind(this, message)}
                 onTouchEnd={this.onThreadTouchEnd.bind(this, message)}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>

        <ContextTrigger id={message.id || Math.random()} holdToDisplay={-1} contextTriggerRef={this.contextTriggerRef}>
          {isFile(message) ?
            <MainMessagesMessageFile {...args}/>
            :
            <MainMessagesMessageText {...args}/>
          }
        </ContextTrigger>
      </Container>
    )
  }
}