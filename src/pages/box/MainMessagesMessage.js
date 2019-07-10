// src/list/BoxSceneMessages
import React, {Component} from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import {connect} from "react-redux";
import classnames from "classnames";
import "moment/locale/fa";
import date from "../../utils/date";

//strings
import strings from "../../constants/localization";

//actions
import {
  threadLeftAsideShowing, threadModalListShowing
} from "../../actions/threadActions";

//components
import Paper, {PaperFooter} from "../../../../uikit/src/paper";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";
import MainMessagesFile from "./MainMessagesFile";
import MainMessagesText from "./MainMessagesText";

//styling
import {
  MdDoneAll,
  MdVideocam,
  MdDone,
  MdErrorOutline,
  MdSchedule,
  MdCameraAlt,
  MdInsertDriveFile,
  MdExpandLess, MdExpandMore, MdDelete, MdForward, MdReply
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessagesMessage.scss";
import styleVar from "./../../../styles/variables.scss";
import {THREAD_LEFT_ASIDE_SEEN_LIST} from "../../constants/actionTypes";
import {avatarNameGenerator, mobileCheck} from "../../utils/helpers";
import {messageDelete, messageEditing} from "../../actions/messageActions";
import {chatModalPrompt} from "../../actions/chatActions";


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

function datePetrification(time) {
  const correctTime = time / Math.pow(10, 6);
  return date.isToday(correctTime) ? date.format(correctTime, "HH:mm") : date.isWithinAWeek(correctTime) ? date.format(correctTime, "dddd HH:mm") : date.format(correctTime, "YYYY-MM-DD  HH:mm");
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


function personNameFragment(message, messages, user, showNameOrAvatar, isMessageByMe) {
  const messageParticipant = message.participant;
  const color = avatarNameGenerator(messageParticipant.name).color;
  return showNameOrAvatar(message, messages) &&
    <Text size="sm" bold
          style={{color: color}}>{isMessageByMe(message, user) ? messageParticipant.name : messageParticipant.contactName || messageParticipant.name}</Text>
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
          <Container className={style.MainMessagesMessage__ReplyFragmentImage}
                     style={{backgroundImage: imageLinkString}}/>
          }
        </Paper>
        <Gap block y={5}/>
      </Container>
    )
  }
  return "";
}

function seenFragment(isMessageByMe, message, user, thread, messageSeenListClick, onRetry, onCancel) {
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
  return <MdDone className={isGroup ? style.MainMessagesMessage__SentIcon : ""} size={style.iconSizeXs}
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
  return "";
}

function highLighterFragment(message, highLightMessage) {
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

function paperFragment(message, messages, user, gotoMessageFunc, showNameOrAvatar, isMessageByMe, {children}) {
  return (
    <Paper style={{borderRadius: "5px"}} hasShadow colorBackgroundLight>
      {personNameFragment(message, messages, user, showNameOrAvatar, isMessageByMe)}
      {replyFragment(message, gotoMessageFunc)}
      {forwardFragment(message)}
      {children}
    </Paper>
  )
}

function paperFragmentFooter(message, onMessageControlShow, {messageControlShow,  messageTriggerShow, children}) {
  const classNames = classnames({
    [style.MainMessagesMessage__OpenTriggerIconContainer]: true,
    [style["MainMessagesMessage__OpenTriggerIconContainer--show"]]: message.id && !messageControlShow && messageTriggerShow,
  });
  return (
    <PaperFooter>
      {children}
      {datePetrification(message.time)}
      <Container inline left inSpace className={classNames}>
        <MdExpandLess size={styleVar.iconSizeMd}
                      className={style.MainMessagesMessage__TriggerIcon}
                      onClick={onMessageControlShow}/>
      </Container>
    </PaperFooter>
  );
}

function controlFragment(isMessageByMe, message, onMessageControlHide, user, onDelete, onForward, onReply, {isText, messageControlShow, children}) {
  return messageControlShow ? (
    <Container className={style.MainMessagesMessage__Control}>
      <Container topLeft>
        <MdExpandMore size={styleVar.iconSizeMd}
                      className={style.MainMessagesMessage__TriggerIcon}
                      style={{margin: "3px"}}
                      onClick={onMessageControlHide}/>
      </Container>
      <Container className={style.MainMessagesMessage__ControlIconContainer}>
        {isMessageByMe(message, user) &&
          <Container inline>
            {isText && message.editable && children}
            <MdDelete size={styleVar.iconSizeMd}
                       className={style.MainMessagesMessage__ControlIcon}
                       onClick={onDelete}/>

          </Container>
        }
        <MdForward size={styleVar.iconSizeMd}
                   className={style.MainMessagesMessage__ControlIcon}
                   onClick={onForward}/>
        <MdReply size={styleVar.iconSizeMd}
                 className={style.MainMessagesMessage__ControlIcon}
                 onClick={onReply}/>
        {!isText && children}
      </Container>
    </Container>
  ) : "";
}

@connect()
export default class MainMessagesMessage extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onForward = this.onForward.bind(this);
    this.onReply = this.onReply.bind(this);
    this.onMessageControlHide = this.onMessageControlHide.bind(this);
    this.onMessageControlShow = this.onMessageControlShow.bind(this);
    this.containerRef = React.createRef();
    this.state = {
      messageControlShow: false,
      messageTriggerShow: false
    };
  }


  onMessageSeenListClick(message, e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEEN_LIST, message.id));
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
    if(!this.state.messageControlShow) {
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

  onMessageControlShow(isClick, e) {
    if(this.state.messageControlShow) {
      return;
    }
    if (isClick === true && !mobileCheck()) {
      return;
    }
    this.setState({
      messageControlShow: true
    });
  }

  onDelete() {
    const {dispatch, message} = this.props;
    dispatch(chatModalPrompt(true, `${strings.areYouSureAboutDeletingMessage()}؟`, () => {
      dispatch(messageDelete(message.id, true));
      dispatch(chatModalPrompt());
    }));
    this.onMessageControlHide();
  }

  onForward() {
    const {dispatch, message} = this.props;
    dispatch(threadModalListShowing(true, message));
    this.onMessageControlHide();
  }

  onReply() {
    const {dispatch, message} = this.props;
    dispatch(messageEditing(message, "REPLYING"));
    this.onMessageControlHide();
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
      isMessageByMe
    } = this.props;
    const {messageControlShow, messageTriggerShow} = this.state;
    const args = {
      ControlFragment: controlFragment.bind(null, messageControlShow, isMessageByMe, message, this.onMessageControlHide, user, this.onDelete, this.onForward, this.onReply),
      HighLighterFragment: highLighterFragment.bind(null, message, highLightMessage),
      SeenFragment: seenFragment.bind(null, isMessageByMe, message, user, thread, this.onMessageSeenListClick.bind(this, message)),
      EditFragment: editFragment.bind(null, message),
      PaperFragment: paperFragment.bind(null, message, messages, user, onRepliedMessageClicked, showNameOrAvatar, isMessageByMe),
      PaperFooterFragment: paperFragmentFooter.bind(null, message, this.onMessageControlShow),
      isMessageByMe: isMessageByMe.bind(null, message, user),
      isFirstMessage: showNameOrAvatar(message, messages),
      datePetrification: datePetrification.bind(null, message.time),
      messageControlShow,
      messageTriggerShow,
      message,
      user
    };
    return (
      <OutsideClickHandler onOutsideClick={this.onMessageControlHide}>
        <Container id={message.uuid}
                   inline inSpace relative
                   maxWidth="50%" minWidth="220px"
                   ref={this.containerRef}
                   onClick={this.onMessageControlShow.bind(this, true)}
                   onMouseOver={this.onMouseOver}
                   onMouseLeave={this.onMouseLeave}>
          {isFile(message) ?
            <MainMessagesFile {...args}/>
            :
            <MainMessagesText {...args}/>
          }
        </Container>
      </OutsideClickHandler>
    )
  }
}