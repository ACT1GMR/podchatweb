// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import "moment/locale/fa";
import {connect} from "react-redux";

//strings

//actions
import {messageCancel, messageEditing, messageSend} from "../../actions/messageActions";

//components
import Container from "../../../../uikit/src/container";
import {ContextItem} from "../../../../uikit/src/menu/Context";
import {Text} from "../../../../uikit/src/typography";
import {
  PaperFragment,
  PaperFooterFragment,
  EditFragment,
  ControlFragment,
  HighLighterFragment,
  SeenFragment
} from "./MainMessagesMessage";

//styling
import style from "../../../styles/pages/box/MainMessagesText.scss";
import {decodeEmoji} from "./MainFooterEmojiIcons";
import strings from "../../constants/localization";

function urlify(text) {
  if (!text) {
    return "";
  }
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    const urlReal = url.replace(/&amp;/g, "&");
    return ReactDOMServer.renderToStaticMarkup(<Text link={urlReal} target="_blank" wordWrap="breakWord"
                                                     title={urlReal}>{urlReal}</Text>)
  })
}

function mentionify(text, onClick) {
  if (!text) {
    return "";
  }
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  var mentionRegex = /@[0-9a-z\u0600-\u06FF](\.?[0-9a-z\u0600-\u06FF])*/gm;
  return text.replace(mentionRegex, function (username) {
    const realUserName = username.replace(/&amp;/g, "&");
    return `<span onClick='window.onUserNameClick(this)'>${ReactDOMServer.renderToStaticMarkup(
      <Text color="accent" dark bold wordWrap="breakWord" inline title={realUserName}>{realUserName}</Text>)}</span>`;
  })
}

@connect()
export default class MainMessagesMessageText extends Component {

  constructor(props) {
    super(props);
    window.onUserNameClick = this.onUserNameClick = this.onUserNameClick.bind(this);
  }

  onRetry(message) {
    const {dispatch} = this.props;
    dispatch(messageCancel(message.uniqueId));
    dispatch(messageSend(message.message, message.threadId));
  }

  onCancel(message) {
    this.props.dispatch(messageCancel(message.uniqueId));
  }

  onEdit(message) {
    const {onMessageControlHide, dispatch} = this.props;
    this.props.dispatch(messageEditing(message));
    onMessageControlHide();
  }

  onUserNameClick(e) {
  }

  render() {
    const {
      onDelete,
      onForward,
      onReply, isMessageByMe,
      isFirstMessage,
      thread,
      messageControlShow,
      messageTriggerShow,
      message,
      highLightMessage,
      onMessageControlShow,
      onRepliedMessageClicked,
      onMessageSeenListClick,
      onMessageControlHide,
      onPin,
      isParticipantBlocked,
      contextRef,
      forceSeen,
      isChannel,
      isOwner,
      isGroup
    } = this.props;
    return (
      <Container className={style.MainMessagesText}>
        <PaperFragment message={message} onRepliedMessageClicked={onRepliedMessageClicked}
                       isChannel={isChannel} isGroup={isGroup}
                       isFirstMessage={isFirstMessage} isMessageByMe={isMessageByMe}>
          <HighLighterFragment message={message} highLightMessage={highLightMessage}/>
          <ControlFragment isMessageByMe={isMessageByMe}
                           isOwner={isOwner}
                           contextRef={contextRef}
                           onPin={onPin}
                           isParticipantBlocked={isParticipantBlocked}
                           messageControlShow={messageControlShow}
                           isChannel={isChannel}
                           isGroup={isGroup}
                           message={message}
                           onMessageControlHide={onMessageControlHide}
                           onDelete={onDelete} onForward={onForward} onReply={onReply}
                           isText={true}>
            {
              message.editable &&
              <ContextItem onClick={this.onEdit.bind(this, message)}>
                {strings.edit}
              </ContextItem>
            }

          </ControlFragment>
          <Container userSelect="text">
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap" color="text" dark>
              {mentionify(urlify(decodeEmoji(message.message)), this.onUserNameClick)}
            </Text>
          </Container>
          <PaperFooterFragment message={message}
                               onMessageControlShow={onMessageControlShow}
                               onMessageControlHide={onMessageControlHide}
                               isMessageByMe={isMessageByMe}
                               messageControlShow={messageControlShow} messageTriggerShow={messageTriggerShow}>
            <SeenFragment isMessageByMe={isMessageByMe} message={message} thread={thread} forceSeen={forceSeen}
                          onMessageSeenListClick={onMessageSeenListClick} onRetry={this.onRetry.bind(this, message)}
                          onCancel={this.onCancel.bind(this, message)}/>
            <EditFragment message={message}/>
          </PaperFooterFragment>
        </PaperFragment>
      </Container>
    );
  }
}