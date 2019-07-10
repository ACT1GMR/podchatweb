// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import "moment/locale/fa";
import {humanFileSize} from "../../utils/helpers";
import classnames from "classnames";

//strings

//actions
import {
  messageSendingError,
  messageCancelFile,
  messageSendFile,
} from "../../actions/messageActions";

//components
import Image from "../../../../uikit/src/image";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Gap from "../../../../uikit/src/gap";

//styling
import {
  MdArrowDownward,
  MdPlayArrow,
  MdClose
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessagesFile.scss";
import MainMessagesMessageStyle from "../../../styles/pages/box/MainMessagesMessage.scss";
import styleVar from "./../../../styles/variables.scss";


function getImage(metaData, isFromServer, smallVersion, fileObject) {
  let imageLink = metaData.link;
  let width = metaData.width;
  let height = metaData.height;

  const ratio = height / width;
  const maxWidth = smallVersion || window.innerWidth <= 700 ? 190 : ratio >= 2 ? 200 : 300;
  if (!isFromServer) {
    if (fileObject && fileObject.type) {
      if (fileObject.type.startsWith("image/")) {
        if (!imageLink) {
          imageLink = URL.createObjectURL(fileObject);
        }
      }
    }
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
    if (message.state === "UPLOADING") {
      return true;
    }
  }
}

function hasError(message) {
  if (message.state === "UPLOAD_ERROR") {
    return true;
  }
}

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    leftAsideShowing: store.threadLeftAsideShowing.isShowing
  };
})
class MainMessagesFile extends Component {

  constructor(props) {
    super(props);
    this.onImageClick = this.onImageClick.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRetry = this.onRetry.bind(this);
  }

  onImageClick(e) {
    e.stopPropagation();
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
    (e || isVideo).stopPropagation();
    if (isVideo === true) {
      return;
    }
    window.location.href = `${metaData.link}&downloadable=true`;
    this.onMessageControlHide();
  }

  onRetry() {
    const {dispatch, message} = this.props;
    this.onCancel(message);
    dispatch(messageSendFile(message.fileObject, message.threadId, message.message));
  }

  onCancel() {
    const {dispatch, message} = this.props;
    dispatch(messageCancelFile(message.uniqueId, message.threadId));
  }

  render() {
    const {ControlFragment, HighLighterFragment, PaperFragment, PaperFooterFragment, SeenFragment, message, leftAsideShowing, smallVersion} = this.props;
    let metaData = message.metadata;
    metaData = typeof metaData === "string" ? JSON.parse(metaData).file : metaData.file;
    const isImage = metaData.mimeType.indexOf("image") > -1;
    const isVideo = metaData.mimeType.indexOf("video") > -1;
    const imageSizeLink = isImage ? getImage(metaData, message.id, smallVersion || leftAsideShowing, message.fileObject) : false;
    const mainMessagesFileImageClassNames = classnames({
      [style.MainMessagesFile__Image]: true,
      [style["MainMessagesFile__Image--smallVersion"]]: smallVersion
    });

    return (
      <Container className={style.MainMessagesFile} key={message.uuid}>
        <HighLighterFragment/>
        <ControlFragment>
          <MdArrowDownward className={MainMessagesMessageStyle.MainMessagesMessage__ControlIcon}
                           size={styleVar.iconSizeMd}
                           onClick={this.onDownload.bind(this, metaData)}/>
        </ControlFragment>
        <PaperFragment>
          <Container relative
                     className={style.MainMessagesFile__FileContainer}>
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
          <PaperFooterFragment>
            <SeenFragment onRetry={this.onRetry} onCancel={this.onCancel}/>
          </PaperFooterFragment>
        </PaperFragment>
      </Container>
    )
  }
}

export default withRouter(MainMessagesFile);