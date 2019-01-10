// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import "moment/locale/fa";
import {humanFileSize, mobileCheck} from "../../utils/helpers";
import classnames from "classnames";

//strings
import strings from "../../constants/localization";

//actions
import {chatModalPrompt} from "../../actions/chatActions";
import {threadModalListShowing, threadModalMediaShowing} from "../../actions/threadActions";
import {
  messageEditing,
  messageSendingError,
  messageCancelFile,
  messageSendFile, messageDelete
} from "../../actions/messageActions";

//components
import Paper, {PaperFooter} from "../../../../uikit/src/paper";
import Image from "../../../../uikit/src/image";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Gap from "../../../../uikit/src/gap";

//styling
import {
  MdDelete,
  MdReply,
  MdForward,
  MdArrowDownward,
  MdPlayArrow,
  MdClose, MdExpandLess, MdExpandMore
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessagesFile.scss";
import styleVar from "./../../../styles/variables.scss";


function getImage(metaData, isFromServer, smallVersion) {
  let imageLink = metaData.link;
  let width = metaData.width;
  let height = metaData.height;

  const ratio = height / width;
  const maxWidth = smallVersion || window.innerWidth <= 700 ? 190 : ratio >= 2 ? 200 : 300;
  if (!isFromServer) {
    return {imageLink, width: maxWidth, height};
  }
  height = Math.ceil(maxWidth * ratio);
  return {
    imageLink: `${imageLink}&width=${maxWidth}&height=${height}`,
    width: maxWidth,
    height,
    imageLinkOrig: imageLink
  };
}

function isDownloadable(message) {
  return message.id;
}

function isUploading(message) {
  if (message.progress) {
    if (message.progress.state === "UPLOADING") {
      return true;
    }
  }
}

function hasError(message) {
  if (message.progress) {
    if (message.progress.state === "UPLOAD_ERROR") {
      return true;
    }
  }
}

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    leftAsideShowing: store.threadLeftAsideShowing
  };
})
class MainMessagesFile extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
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

  onImageClick(e) {
    e.stopPropagation();
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

  componentDidUpdate() {
    const {message, dispatch} = this.props;
    if (message) {
      if (message.progress) {
        if (!message.hasError) {
          if (hasError(message)) {
            dispatch(messageSendingError(message.threadId, message.uniqueId));
          }
        }
      }
    }
  }

  onDownload(metaData, isVideo, e) {
    e.stopPropagation();
    if (isVideo) {
      return;
    }
    window.location.href = `${metaData.link}&downloadable=true`;
    this.onMessageControlHide();
  }

  onCancel(message) {
    this.props.dispatch(messageCancelFile(message.fileUniqueId, message.threadId));
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

  onModalMediaShow(metaData) {
    this.props.dispatch(threadModalMediaShowing(true, {src: metaData.link}));
  }

  render() {
    const {highLighterFragment, seenFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user, dispatch, smallVersion, leftAsideShowing, location} = this.props;
    const {messageControlShow, messageTriggerShow} = this.state;
    let metaData = message.metaData;
    metaData = typeof metaData === "string" ? JSON.parse(metaData).file : metaData.file;
    const isImage = ~metaData.mimeType.indexOf("image");
    const isVideo = ~metaData.mimeType.indexOf("video");
    const imageSizeLink = isImage ? getImage(metaData, message.id, smallVersion || leftAsideShowing) : false;
    const isMsgByMe = isMessageByMe(message, user);
    const classNames = classnames({
      [style.MainMessagesFile]: true,
      [style["MainMessagesFile--triggerIconShow"]]: message.id && !messageControlShow && messageTriggerShow
    });
    const mainMessagesFileImageClassNames = classnames({
      [style.MainMessagesFile__Image]: true,
      [style["MainMessagesFile__Image--smallVersion"]]: smallVersion
    });
    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px" className={classNames}
                 id={message.uuid}
                 onClick={this.onMessageControlShow.bind(this, true)}
                 ref={this.containerRef}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        {highLighterFragment(message)}
        {messageControlShow ?
          <Container className={style.MainMessagesFile__Control}>
            <Container topLeft={isMessageByMe(message, user)} topRight={!isMessageByMe(message, user)}>
              <MdExpandMore size={styleVar.iconSizeMd}
                            className={style.MainMessagesFile__TriggerIcon}
                            style={{margin: "3px"}}
                            onClick={this.onMessageControlHide.bind(this)}/>
            </Container>
            <Container center centerTextAlign style={{width: "100%"}}>
              {isMessageByMe(message, user) &&
              <MdDelete size={styleVar.iconSizeMd}
                        className={style.MainMessagesFile__ControlIcon}
                        onClick={this.onDelete.bind(this, message)}/>
              }
              <MdForward size={styleVar.iconSizeMd}
                         className={style.MainMessagesFile__ControlIcon}
                         onClick={this.onForward.bind(this, message)}/>
              <MdReply size={styleVar.iconSizeMd}
                       className={style.MainMessagesFile__ControlIcon}
                       onClick={this.onReply.bind(this, message)}/>
              <MdArrowDownward size={styleVar.iconSizeMd}
                               className={style.MainMessagesFile__ControlIcon}
                               onClick={this.onDownload.bind(this, metaData)}/>
            </Container>
          </Container>
          : ""}
        <Container relative>
          {isUploading(message) ?
            <Container className={style.MainMessagesFile__Progress}
                       style={{width: `${message.progress ? message.progress.progress : 0}%`}}
                       title={`${message.progress && message.progress.progress}`}/>
            : ""}
          <Paper colorBackgroundLight borderRadius={5} hasShadow>
            {replyFragment(message)}
            {forwardFragment(message)}
            <Container relative
                       className={`${style.MainMessagesFile__FileContainer} ${!isImage && !isMsgByMe ? style["MainMessagesFile__FileContainer--reverseDirection"] : ""}`}>
              {isImage ?
                <Container style={{width: `${imageSizeLink.width}px`}}>
                  <Container className={style.MainMessagesFile__ImageContainer}>
                    <Text link={imageSizeLink.imageLinkOrig}
                          linkClearStyle
                          data-options={`{"caption": "${message.message || ""}"}`}>
                      <Image className={mainMessagesFileImageClassNames}
                             onClick={this.onImageClick}
                             src={imageSizeLink.imageLink}
                             style={{maxWidth: `${imageSizeLink.width}px`, height: `${imageSizeLink.height}px`}}/>
                    </Text>
                  </Container>
                  <Container>
                    <Text wordWrap="breakWord" bold>
                      {message.message}
                    </Text>
                  </Container>

                </Container>
                :
                <Container className={style.MainMessagesFile__FileName}>
                  {isVideo ?
                  <video controls id={`video-${message.id}`} style={{display: "none"}}>
                    <source src={metaData.link} type={metaData.mimeType}/>
                  </video> : ""
                  }
                  <Text wordWrap="breakWord" bold>
                    {metaData.originalName}
                  </Text>
                  <Text size="xs" color="gray">
                    {humanFileSize(metaData.size, true)}
                  </Text>
                </Container>
              }
              <Container className={style.MainMessagesFile__FileControlIcon} center={isImage}>
                {(isDownloadable(message) && !isImage) || isUploading(message) || hasError(message) ?
                  <Gap x={10}>
                    <Shape color="accent" size="lg"
                           onClick={isDownloadable(message) ? this.onDownload.bind(this, metaData, isVideo) : this.onCancel.bind(this, message)}>
                      <ShapeCircle>
                        {isUploading(message) || hasError(message) ?
                          <MdClose style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
                          : isDownloadable(message) ?
                            isVideo ?
                              <Text link={`#video-${message.id}`} linkClearStyle data-fancybox>
                                <MdPlayArrow style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
                              </Text>
                              :
                              <MdArrowDownward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/> : ""
                        }
                      </ShapeCircle>
                    </Shape>
                  </Gap>
                  : ""}

              </Container>

            </Container>

            <PaperFooter>
              {seenFragment(message, () => {
                this.onCancel(message);
                dispatch(messageSendFile(message.content.file.fileObject, message.threadId, message.message));
              })}
              {datePetrification(message.time)}
              <Container inline left={isMessageByMe(message, user)} right={!isMessageByMe(message, user)} inSpace
                         className={style.MainMessagesFile__OpenTriggerIconContainer}>
                <MdExpandLess size={styleVar.iconSizeMd}
                              className={style.MainMessagesFile__TriggerIcon}
                              onClick={this.onMessageControlShow.bind(this)}/>
              </Container>
            </PaperFooter>
          </Paper>
        </Container>
      </Container>
    );
  }
}

export default withRouter(MainMessagesFile);