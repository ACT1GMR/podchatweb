// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import "moment/locale/fa";
import {humanFileSize} from "../../utils/helpers";

//strings

//actions
//actions
import {
  threadModalMediaShowing
} from "../../actions/threadActions";

//components
import Paper, {PaperFooter} from "raduikit/src/paper";
import Container from "raduikit/src/container";
import {Text} from "raduikit/src/typography";
import Shape, {ShapeCircle} from "raduikit/src/shape";
import {
  MdDelete,
  MdEdit,
  MdReply,
  MdForward,
  MdArrowDownward,
  MdClose
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneMessagesFile.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import styleVar from "./../../../styles/variables.scss";
import {messageEditing} from "../../actions/messageActions";
import {threadModalListShowing} from "../../actions/threadActions";
import {connect} from "react-redux";

function getImage(metaData, isFromServer) {

  let imageLink = metaData.link;
  let width = metaData.width;
  let height = metaData.height;

  const ratio = height / width;
  const maxWidth = ratio >= 2 ? 200 : 300;
  if (width <= maxWidth) {
    return {imageLink};
  }
  if (!isFromServer) {
    return {imageLink, maxWidth};
  }
  height = Math.ceil(maxWidth * ratio);
  return {imageLink: `${imageLink}&width=${maxWidth}&height=${height}`, maxWidth};
}

function isDownloadable(message) {
  if (!message.progress) {
    return true;
  }
  const msgStatus = message.progress.status;
  if (msgStatus === "DONE") {
    return true;
  }
}

@connect()
export default class BoxSceneMessagesFile extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      messageControlShow: false
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

  onCancel(metaData) {
    window.location.href = `${metaData.link}&downloadable=true`;
  }

  onEdit(id, message) {
    this.props.dispatch(messageEditing(id, message));
  }

  onDelete(id) {

  }

  onForward(el) {
    this.props.dispatch(threadModalListShowing(true, el.id, el.message));
  }

  onReply(id, message) {
    this.props.dispatch(messageEditing(id, message, "REPLYING"));
  }

  onModalMediaShow(metaData) {
    this.props.dispatch(threadModalMediaShowing(true, {src: metaData.link}));
  }

  render() {
    const {seenFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user} = this.props;
    const {messageControlShow} = this.state;
    let metaData = message.metaData;
    metaData = typeof metaData === "string" ? JSON.parse(metaData).file : metaData.file;
    const isImage = ~metaData.mimeType.indexOf("image");
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;
    const imageSizeLink = isImage ? getImage(metaData, message.id) : false;
    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px"
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        <Container relative>
          {message.progress && message.progress.state === "UPLOADING" ?
            <div className={style.BoxSceneMessagesFile__Progress}
                 style={{width: `${message.progress ? message.progress.progress : 0}%`}}
                 title={`${message.progress && message.progress.progress}`}/>
            : ""}

          <Paper colorBackgroundLight borderRadius={5}>
            {replyFragment(message)}
            {forwardFragment(message)}
            {isImage ?
              <img className={style.BoxSceneMessagesFile__Image} src={imageSizeLink.imageLink}
                   style={{width: `${imageSizeLink.maxWidth}px`}}
                   onClick={message.id && this.onModalMediaShow.bind(this, metaData)}/>
              :
              <Container relative>
                <Container maxWidth="calc(100% - 36px)">
                  <Text bold>
                    {metaData.originalName}
                  </Text>
                  <Text size="xs" color="gray">
                    {humanFileSize(metaData.size, true)}
                  </Text>
                </Container>

                <Container centerLeft className={"u-clickable"}>
                  <Shape color="accent" size="lg" onClick={isDownloadable(message) ? this.onDownload.bind(this, metaData) : this.onCancel.bind(this, metaData)}>
                    <ShapeCircle>
                      {isDownloadable(message) ?
                        <MdArrowDownward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
                        :
                        <MdClose style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
                      }
                    </ShapeCircle>
                  </Shape>
                </Container>

              </Container>

            }
            <PaperFooter>
              {seenFragment(message)}
              {datePetrification(message.time)}
              {message.id && messageControlShow ?
                <Container inline left={isMessageByMe(message, user)} right={!isMessageByMe(message, user)} inSpace>
                  {isMessageByMe(message, user) &&
                  <Container inline>
                    {message.deletable && <MdDelete style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                                    className={iconClasses}
                                                    onClick={this.onDelete.bind(this, message.id)}/>}
                  </Container>
                  }
                  <MdForward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                             className={iconClasses}/>
                  <MdReply style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                           className={iconClasses}/>
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