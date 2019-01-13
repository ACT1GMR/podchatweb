// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import "moment/locale/fa";
import {mobileCheck} from "../../utils/helpers";
import classnames from "classnames";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

//strings
import strings from "../../constants/localization";

//actions
import {chatModalPrompt} from "../../actions/chatActions";
import {messageDelete, messageEditing} from "../../actions/messageActions";
import {threadModalListShowing} from "../../actions/threadActions";

//components
import Paper, {PaperFooter} from "../../../../uikit/src/paper";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import {
  MdExpandLess,
  MdExpandMore,
  MdDelete,
  MdEdit,
  MdReply,
  MdForward,
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainMessagesText.scss";
import styleVar from "./../../../styles/variables.scss";

function urlify(text) {
  if(!text) {
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
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.containerRef = React.createRef();
    document.addEventListener('click', this.handleClickOutside.bind(this));
    this.state = {
      messageControlShow: false,
      messageTriggerShow: false
    };
  }

  handleClickOutside(e) {
    const {messageControlShow} = this.state;
    if (!messageControlShow) {
      return;
    }
    if (!this.containerRef.current) {
      return;
    }
    const target = e.target;
    const node = ReactDOM.findDOMNode(this.containerRef.current);
    if (!node.contains(target)) {
      this.onMessageControlHide();
    }
  }

  onMouseOver() {
    if (mobileCheck()) {
      return;
    }
    this.setState({
      messageTriggerShow: true
    });
  }

  onMouseLeave() {
    this.setState({
      messageTriggerShow: false
    });
  }

  onMessageControlShow(isClick, e) {
    if (isClick === true && !mobileCheck()) {
      return;
    }
    this.setState({
      messageControlShow: true
    });
  }

  onMessageControlHide(e) {
    if (e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }
    this.setState({
      messageControlShow: false
    });
  }

  onEdit(message) {
    this.props.dispatch(messageEditing(message));
    this.onMessageControlHide();
  }

  onDelete(message) {
    const {dispatch} = this.props;
    dispatch(chatModalPrompt(true, `${strings.areYouSureAboutDeletingMessage()}؟`, () => {
      dispatch(messageDelete(message.id, message.editable));
      dispatch(chatModalPrompt());
    }));
    this.onMessageControlHide();
  }

  onForward(message) {
    this.props.dispatch(threadModalListShowing(true, message));
    this.onMessageControlHide();
  }

  onReply(message) {
    this.props.dispatch(messageEditing(message, "REPLYING"));
    this.onMessageControlHide();
  }

  render() {
    const {highLighterFragment, seenFragment, editFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user, personNameFragment} = this.props;
    const {messageControlShow, messageTriggerShow} = this.state;
    const classNames = classnames({
      [style.MainMessagesText]: true,
      [style["MainMessagesText--triggerIconShow"]]: message.id && !messageControlShow && messageTriggerShow
    });
    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px" className={classNames}
                 ref={this.containerRef}
                 onClick={this.onMessageControlShow.bind(this, true)}
                 id={message.uuid}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        {highLighterFragment(message)}
        {messageControlShow ?
          <Container className={style.MainMessagesText__Control}>
            <Container topLeft={isMessageByMe(message, user)} topRight={!isMessageByMe(message, user)}>
              <MdExpandMore size={styleVar.iconSizeMd}
                            className={style.MainMessagesText__TriggerIcon}
                            style={{margin: "3px"}}
                            onClick={this.onMessageControlHide.bind(this)}/>
            </Container>
            <Container className={style.MainMessagesText__ControlIconContainer}>
              {isMessageByMe(message, user) &&
              <Container inline>
                {message.editable && <MdEdit size={styleVar.iconSizeMd}
                                             className={style.MainMessagesText__ControlIcon}
                                             onClick={this.onEdit.bind(this, message)}/>}
                {<MdDelete size={styleVar.iconSizeMd}
                           className={style.MainMessagesText__ControlIcon}
                           onClick={this.onDelete.bind(this, message)}/>
                }
              </Container>
              }
              <MdForward size={styleVar.iconSizeMd}
                         className={style.MainMessagesText__ControlIcon}
                         onClick={this.onForward.bind(this, message)}/>
              <MdReply size={styleVar.iconSizeMd}
                       className={style.MainMessagesText__ControlIcon}
                       onClick={this.onReply.bind(this, message)}/>
            </Container>
          </Container>
          : ""}
        <Paper colorBackgroundLight borderRadius={5} hasShadow>
          {personNameFragment(message)}
          {replyFragment(message)}
          {forwardFragment(message)}
          <Container userSelect="text">
            <Text isHTML wordWrap="breakWord" whiteSpace="preWrap">
              {urlify(message.message)}
            </Text>
          </Container>
          <PaperFooter>
            {seenFragment(message, user)}
            {editFragment(message)}
            {datePetrification(message.time)}
            <Container inline left={isMessageByMe(message, user)} right={!isMessageByMe(message, user)} inSpace
                       className={style.MainMessagesText__OpenTriggerIconContainer}>
              <MdExpandLess size={styleVar.iconSizeMd}
                            className={style.MainMessagesText__TriggerIcon}
                            onClick={this.onMessageControlShow.bind(this)}/>
            </Container>
          </PaperFooter>
        </Paper>
      </Container>
    );
  }
}