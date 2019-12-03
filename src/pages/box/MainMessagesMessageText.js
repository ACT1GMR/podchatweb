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
import {Text} from "../../../../uikit/src/typography";
import {MdEdit} from "react-icons/lib/md";
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
import MainMessagesMessageStyle from "../../../styles/pages/box/MainMessagesMessage.scss";
import styleVar from "./../../../styles/variables.scss";
import {decodeEmoji} from "./MainFooterEmojiIcons";

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

@connect()
export default class MainMessagesMessageText extends Component {

  constructor(props) {
    super(props);
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
      isParticipantBlocked,
      forceSeen,
      isChannel,
      isGroup
    } = this.props;
    return (
      <Container className={style.MainMessagesText}>
        <PaperFragment message={message} onRepliedMessageClicked={onRepliedMessageClicked}
                       isChannel={isChannel} isGroup={isGroup}
                       isFirstMessage={isFirstMessage} isMessageByMe={isMessageByMe}>
          <HighLighterFragment message={message} highLightMessage={highLightMessage}/>
          <ControlFragment isMessageByMe={isMessageByMe}
                           isParticipantBlocked={isParticipantBlocked}
                           messageControlShow={messageControlShow}
                           isChannel={isChannel}
                           message={message}
                           onMessageControlHide={onMessageControlHide}
                           onDelete={onDelete} onForward={onForward} onReply={onReply}
                           isText={true}>
            <MdEdit className={MainMessagesMessageStyle.MainMessagesMessage__ControlIcon}
                    size={styleVar.iconSizeMd}
                    onClick={this.onEdit.bind(this, message)}/>
          </ControlFragment>
          <Container userSelect="text">
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap" color="text" dark>
              {urlify(decodeEmoji(message.message))}
            </Text>
          </Container>
          <PaperFooterFragment message={message} onMessageControlShow={onMessageControlShow}
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