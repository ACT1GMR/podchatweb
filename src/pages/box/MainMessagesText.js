// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import "moment/locale/fa";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

//strings

//actions
import {messageEditing} from "../../actions/messageActions";
import {threadModalListShowing} from "../../actions/threadActions";


//components
import Paper, {PaperFooter} from "raduikit/src/paper";
import Container from "raduikit/src/container";
import {Text} from "raduikit/src/typography";
import {
  MdDelete,
  MdEdit,
  MdReply,
  MdForward,
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainMessagesText.scss";
import utilsStyle from "../../../styles/utils/utils.scss";
import styleVar from "./../../../styles/variables.scss";

function urlify(text) {
  return reactStringReplace(text, /(https?:\/\/[^\s]+)/g, (match, i) => (
    <Text link={match} target="_blank" wordWrap="breakWord">{match}</Text>
  ));
}

@connect()
export default class MainMessagesText extends Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      messageControlShow: false
    };
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


  onEdit(message) {
    this.props.dispatch(messageEditing(message));
  }

  onDelete(id) {

  }

  onForward(message) {
    this.props.dispatch(threadModalListShowing(true, message));
  }

  onReply(message) {
    this.props.dispatch(messageEditing(message, "REPLYING"));
  }

  render() {
    const {seenFragment, editFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user} = this.props;
    const {messageControlShow} = this.state;
    const iconClasses = `${utilsStyle["u-clickable"]} ${utilsStyle["u-hoverColorAccent"]}`;

    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px" className={style.MainMessagesText}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        <Paper colorBackgroundLight borderRadius={5} hasShadow>
          {replyFragment(message)}
          {forwardFragment(message)}
          <Text wordWrap="breakWord">
            {urlify(message.message)}
          </Text>
          <PaperFooter>
            {seenFragment(message, user)}
            {editFragment(message)}
            {datePetrification(message.time)}
            {message.id && messageControlShow ?
              <Container inline left={isMessageByMe(message, user)} right={!isMessageByMe(message, user)} inSpace>
                {isMessageByMe(message, user) &&
                <Container inline>
                  {message.editable && <MdEdit style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                               className={iconClasses}
                                               onClick={this.onEdit.bind(this, message)}/>}
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
              </Container> : ""
            }
          </PaperFooter>
        </Paper>
      </Container>
    );
  }
}