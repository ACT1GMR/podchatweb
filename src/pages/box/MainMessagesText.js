// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import "moment/locale/fa";
import {mobileCheck} from "../../utils/helpers";
import classnames from "classnames";
import {connect} from "react-redux";

//strings

//actions
import {messageCancel, messageEditing, messageSend} from "../../actions/messageActions";

//components
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import {MdEdit} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainMessagesText.scss";
import MainMessagesMessageStyle from "../../../styles/pages/box/MainMessagesMessage.scss";
import styleVar from "./../../../styles/variables.scss";

function urlify(text) {
  if (!text) {
    return "";
  }
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return ReactDOMServer.renderToStaticMarkup(<Text link={url} target="_blank" wordWrap="breakWord">{url}</Text>)
  })
}

@connect()
export default class MainMessagesText extends Component {

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
    this.props.dispatch(messageEditing(message));
    this.onMessageControlHide();
  }

  render() {
    const {ControlFragment, HighLighterFragment, EditFragment, PaperFragment, PaperFooterFragment, SeenFragment, message} = this.props;
    return (
      <Container className={style.MainMessagesText}>
        <HighLighterFragment/>
        <ControlFragment isText={true}>
          <MdEdit className={MainMessagesMessageStyle.MainMessagesMessage__ControlIcon}
                  size={styleVar.iconSizeMd}
                  onClick={this.onEdit.bind(this, message)}/>
        </ControlFragment>
        <PaperFragment>
          <Container userSelect="text">
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap">
              {urlify(message.message)}
            </Text>
          </Container>
          <PaperFooterFragment onMessageControlShow={this.onMessageControlShow}>
            <SeenFragment onRetry={this.onRetry.bind(this, message)} onCancel={this.onCancel.bind(this, message)}/>
            <EditFragment/>
          </PaperFooterFragment>
        </PaperFragment>
      </Container>
    );
  }
}