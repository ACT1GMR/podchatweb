// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import "moment/locale/fa";
import {humanFileSize} from "../../utils/helpers";

//strings

//actions

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
  MdArrowDownward
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneMessagesFile.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import styleVar from "./../../../styles/variables.scss";
import {messageEditing} from "../../actions/messageActions";
import {threadModalListShowing} from "../../actions/threadActions";
import {connect} from "react-redux";


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

  render() {
    const {seenFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user} = this.props;
    const {messageControlShow} = this.state;
    let metaData = message.metaData;
    metaData = typeof metaData === "string" ? JSON.parse(metaData).file : metaData.file;
    const isImage = ~metaData.mimeType.indexOf("image");
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;
    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px"
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        <Paper colorBackgroundLight borderRadius={5}>
          {replyFragment(message)}
          {forwardFragment(message)}
          {isImage ?
            <img className={style.BoxSceneMessagesFile__Image} src={metaData.link}/>
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
                <Shape color="accent" size="lg" onClick={this.onDownload.bind(this, metaData)}>
                  <ShapeCircle>
                    <MdArrowDownward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}/>
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
    );
  }
}