// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import "moment/locale/fa";
import {humanFileSize} from "../../utils/helpers";
import {connect} from "react-redux";

//strings

//actions
import {threadModalListShowing, threadModalMediaShowing} from "../../actions/threadActions";
import {messageEditing, messageSendingError, messageCancelFile, messageSendFile} from "../../actions/messageActions";

//components
import Paper, {PaperFooter} from "raduikit/src/paper";
import Container from "raduikit/src/container";
import {Text} from "raduikit/src/typography";
import Shape, {ShapeCircle} from "raduikit/src/shape";
import {
  MdDelete,
  MdReply,
  MdForward,
  MdArrowDownward,
  MdClose
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainMessagesFile.scss";
import utilsStyle from "../../../styles/utils/utils.scss";
import styleVar from "./../../../styles/variables.scss";
import Gap from "../../../../uikit/src/gap";


function getImage(metaData, isFromServer) {
  let imageLink = metaData.link;
  let width = metaData.width;
  let height = metaData.height;

  const ratio = height / width;
  const maxWidth = window.innerWidth <= 700 ? 190 : ratio >= 2 ? 200 : 300;
  if (!isFromServer) {
    return {imageLink, width: maxWidth, height};
  }
  height = Math.ceil(maxWidth * ratio);
  return {imageLink: `${imageLink}&width=${maxWidth}&height=${height}`, width: maxWidth, height};
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

@connect()
export default class MainMessagesFile extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      messageControlShow: false
    };
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

  onMouseOver() {
    this.setState({
      messageControlShow: true
    });
  }

  onMouseLeave() {
    this.setState({
      messageControlShow: false
    });
  }

  onDownload(metaData) {
    window.location.href = `${metaData.link}&downloadable=true`;
  }

  onCancel(message) {
    this.props.dispatch(messageCancelFile(message.fileUniqueId, message.threadId));
  }

  onEdit(id, message) {
    this.props.dispatch(messageEditing(id, message));
  }

  onDelete(id) {

  }

  onForward(message) {
    this.props.dispatch(threadModalListShowing(true, message));
  }

  onReply(message) {
    this.props.dispatch(messageEditing(message, "REPLYING"));
  }

  onModalMediaShow(metaData) {
    this.props.dispatch(threadModalMediaShowing(true, {src: metaData.link}));
  }

  render() {
    const {seenFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user, dispatch} = this.props;
    const {messageControlShow} = this.state;
    let metaData = message.metaData;
    metaData = typeof metaData === "string" ? JSON.parse(metaData).file : metaData.file;
    const isImage = ~metaData.mimeType.indexOf("image");
    const iconClasses = `${utilsStyle["u-clickable"]} ${utilsStyle["u-hoverColorAccent"]}`;
    const imageSizeLink = isImage ? getImage(metaData, message.id) : false;
    const isMsgByMe = isMessageByMe(message, user);
    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px"
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        <Container relative>
          {isUploading(message) ?
            <div className={style.MainMessagesFile__Progress}
                 style={{width: `${message.progress ? message.progress.progress : 0}%`}}
                 title={`${message.progress && message.progress.progress}`}/>
            : ""}
          <Paper colorBackgroundLight borderRadius={5} hasShadow>
            {replyFragment(message)}
            {forwardFragment(message)}
            <Container relative className={`${style.MainMessagesFile__FileContainer} ${!isImage && !isMsgByMe ? style["MainMessagesFile__FileContainer--reverseDirection"]: ""}`}>
              {isImage ?
                <img className={style.MainMessagesFile__Image} src={imageSizeLink.imageLink}
                     style={{width: `${imageSizeLink.width}px`, height: `${imageSizeLink.height}px`}}
                     onClick={message.id && this.onModalMediaShow.bind(this, metaData)}/> :

                <Container className={style.MainMessagesFile__FileName}>
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
                           onClick={isDownloadable(message) ? this.onDownload.bind(this, metaData) : this.onCancel.bind(this, message)}>
                      <ShapeCircle>
                        {isUploading(message) || hasError(message) ?
                          <MdClose style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
                          : isDownloadable(message) ?
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
                dispatch(messageSendFile(message.content.file.fileObject, message.threadId));
              })}
              {datePetrification(message.time)}
              {message.id && messageControlShow ?
                <Container inline left={isMsgByMe} right={!isMsgByMe} inSpace>
                  {isMsgByMe &&
                  <Container inline>
                    {message.deletable && <MdDelete style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                                    className={iconClasses}
                                                    onClick={this.onDelete.bind(this, message.id)}/>}
                  </Container>
                  }
                  <MdForward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                             className={iconClasses}
                             onClick={this.onForward.bind(this, message)}/>
                  <MdReply style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                           className={iconClasses}
                           onClick={this.onReply.bind(this, message)}/>
                  <MdArrowDownward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                   className={iconClasses}
                                   onClick={this.onDownload.bind(this, metaData)}/>
                </Container> : ""
              }
            </PaperFooter>
          </Paper>
        </Container>
      </Container>
    );
  }
}