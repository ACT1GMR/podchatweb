// src/list/BoxSceneMessagesText
import React, {Component} from "react";
import "moment/locale/fa";
import reactStringReplace from "react-string-replace";

//strings

//actions

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
import utilsStlye from "../../../styles/utils/utils.scss";
import styleVar from "./../../../styles/variables.scss";
import {messageEditing} from "../../actions/messageActions";
import {threadModalListShowing} from "../../actions/threadActions";
import {connect} from "react-redux";

function urlify(text) {
  return reactStringReplace(text, /(https?:\/\/[^\s]+)/g, (match, i) => (
    <Text link={match} target="_blank">{match}</Text>
  ));
}

@connect()
export default class BoxSceneMessagesText extends Component {

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
    const {seenFragment, editFragment, replyFragment, forwardFragment, isMessageByMe, datePetrification, message, user} = this.props;
    const {messageControlShow} = this.state;
    const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;

    return (
      <Container inline inSpace relative maxWidth="50%" minWidth="220px"
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
        <Paper colorBackgroundLight borderRadius={5}>
          {replyFragment(message)}
          {forwardFragment(message)}
          <Text>
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
                                               onClick={this.onEdit.bind(this, message.id, message.message)}/>}
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
                         onClick={this.onReply.bind(this, message.id, message.message)}/>
              </Container> : ""
            }
          </PaperFooter>
        </Paper>
      </Container>
    );
  }
}