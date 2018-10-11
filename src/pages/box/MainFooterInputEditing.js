// src/list/BoxScene.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {messageEditing} from "../../actions/messageActions";

//components
import Paper from "raduikit/src/paper";
import Container from "raduikit/src/container";
import {Text} from "raduikit/src/typography";
import {MdClose, MdForward, MdEdit, MdReply} from "react-icons/lib/md";

//styling
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
    const {messageEditing, setInputText} = this.props;
    if (messageEditing) {
      if (messageEditing.type !== constants.replying) {
        if (prevProps.messageEditing !== messageEditing) {
          if (messageEditing.type !== constants.replying && messageEditing.type !== constants.forwarding) {
            setInputText(messageEditing.message.message);
          }
        }
      }
    }
  }

  onCancelEditing(event, id) {
    this.props.dispatch(messageEditing());
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
                  <Container className={style.MainFooterInputEditing__Image} style={{backgroundImage: `url(${editObject.image})`}}/>
                </Container>
                : ""}
              {editObject.text}
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