// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {messageEditing} from "../../actions/messageActions";
import {threadIsSendingMessage} from "../../actions/threadActions";

//components
import Paper from "../../../../uikit/src/paper";
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";

//styling
import {MdClose, MdForward, MdEdit, MdReply} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainFooterInputEditing.scss";
import styleVar from "./../../../styles/variables.scss";
import utilsStlye from "../../../styles/utils/utils.scss";

const constants = {
  replying: "REPLYING",
  forwarding: "FORWARDING"
};

export function messageEditingCondition(messageEditing) {
  if (messageEditing) {
    if (messageEditing.message) {
      return true;
    }
  }
}

function getImage(metaData) {

  let imageLink = metaData.link;
  let width = metaData.width;
  let height = metaData.height;

  const ratio = height / width;
  const maxWidth = 30;
  if (width <= maxWidth) {
    return {imageLink};
  }
  height = Math.ceil(maxWidth * ratio);
  return `${imageLink}&width=${maxWidth}&height=${height}`;
}

function getMessageEditingText(messageEditing) {
  const editObject = {text: null};
  if (messageEditing) {
    const message = messageEditing.message;
    if (message) {
      if(message instanceof Array) {
        editObject.text = strings.messagesCount(message.length);
      } else {
        if (message.metaData) {
          const file = JSON.parse(message.metaData).file;
          if (file) {
            let width = file.width;
            editObject.text = file.originalName;
            if (width) {
              editObject.image = getImage(file);
            }
          } else {
            editObject.text = message.message;
          }
        } else {
          editObject.text = message.message;
        }
      }
    }
    return editObject;
  }
}

@connect(store => {
  return {
    messageEditing: store.messageEditing
  };
})
export default class MainFooterInputEditing extends Component {

  constructor(props) {
    super(props);
    this.onCancelEditing = this.onCancelEditing.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {messageEditing, setInputText, dispatch} = this.props;
    if (messageEditing) {
      if (messageEditing.type !== constants.replying) {
        if (prevProps.messageEditing !== messageEditing) {
          if (messageEditing.type !== constants.replying && messageEditing.type !== constants.forwarding) {
            setInputText(messageEditing.message.message);
          } else {
            dispatch(threadIsSendingMessage(true));
          }
        }
      }
    }
  }

  onCancelEditing() {
    const {messageEditing: msgEditing, dispatch} = this.props;
    if (msgEditing.type === constants.forwarding) {
      dispatch(threadIsSendingMessage(false));
    }
    dispatch(messageEditing());
  }

  render() {
    const {messageEditing} = this.props;
    const isEditing = messageEditingCondition(messageEditing);
    let editObject;
    if (isEditing) {
      editObject = getMessageEditingText(messageEditing);
      return (

        <Paper colorBackgroundLight borderRadius="20px 20px 0 0">
          <Container inline className={style.MainFooterInputEditing}>
            <Container>
              {messageEditing.type === constants.forwarding ?
                <MdForward style={{margin: "0 5px"}} size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
                :
                messageEditing.type === constants.replying ?
                  <MdReply style={{margin: "0 5px"}} size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
                  :
                  <MdEdit style={{margin: "0 5px"}} size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
              }
            </Container>

            <Container className={style.MainFooterInputEditing__Content}>
              {editObject.image ?
                <Container className={style.MainFooterInputEditing__ImageContainer} inline>
                  <Container className={style.MainFooterInputEditing__Image}
                             style={{backgroundImage: `url(${editObject.image})`}}/>
                </Container>
                : ""}
              <Container inline>
                <Text size="sm" isHTML>{editObject.text}</Text>
              </Container>
            </Container>

            <Container>
              <MdClose size={styleVar.iconSizeSm} color={styleVar.colorTextLight} style={{margin: "0 4px"}}
                       className={`${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`}
                       onClick={this.onCancelEditing}/>
            </Container>
          </Container>
        </Paper>
      );
    }
    return false;
  }
}