// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {messageSend, messageEditing, messageEdit, messageReply} from "../../actions/messageActions";
import {threadMessageGetList} from "../../actions/threadActions";

//components
import Content from "raduikit/src/content";
import Container from "raduikit/src/container";
import {MdClose, MdChevronLeft} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneInput.scss";
import styleVar from "./../../../styles/variables.scss";

const constants = {
  replying: "REPLYING"
};

@connect(store => {
  return {
    messageSent: store.message.sentMessage,
    messageEditing: store.messageEditing.message,
    messageEdit: store.message.messageEdit,
    threadId: store.thread.thread.id,
    threadFetching: store.thread.thread.id
  };
})
export default class BoxSceneInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onCancelEditing = this.onCancelEditing.bind(this);
    this.inputNode = React.createRef();
    this.state = {
      messageText: ""
    }
  }

  componentDidUpdate(prevProps) {
    const {messageEditing} = this.props;
    if (messageEditing) {
      if(messageEditing.type !== constants.replying){
        if (prevProps.messageEditing !== messageEditing) {
          if(messageEditing.type !== constants.replying){
            this.setState({
              messageText: messageEditing.text ? messageEditing.text : ""
            });
          }
        }
      }
    }
    const current = this.inputNode.current;
    if(current) {
      current.focus();
    }
  }

  onFormSubmit(msgEditing, evt) {
    evt.preventDefault();
    const {threadId} = this.props;
    if (msgEditing) {
      if(msgEditing.type === constants.replying) {
        this.props.dispatch(messageReply(this.state.messageText, msgEditing.id, threadId));
      } else {
        this.props.dispatch(messageEdit(this.state.messageText, msgEditing.id));
      }
    } else {
      this.props.dispatch(messageSend(this.state.messageText, threadId));
    }

    this.props.dispatch(messageEditing());
    this.setState({messageText: ""});
  }

  onTextChange(event) {
    this.setState({messageText: event.target.value});
  }

  onCancelEditing(event, id) {
    this.props.dispatch(messageEditing());
  }

  render() {
    const {messageEditing} = this.props;
    const {messageText} = this.state;
    let editingPopup = messageEditing && messageEditing.text ?
      <Container relative>
        <Content hasBackground>
          {messageEditing.text}
          <Container inline left>
            <MdClose size={styleVar.iconSizeSm} color={styleVar.colorTextLight} style={{margin: "0 4px"}} className={"u-clickable u-hoverColorAccent"} onClick={this.onCancelEditing}/>
          </Container>
        </Content>
      </Container> : '';

    return (
      <form className={style.BoxSceneInput} onSubmit={this.onFormSubmit.bind(this, messageEditing)}>
        {editingPopup}
        <input className={style.BoxSceneInput__text}
               ref={this.inputNode}
               type="text"
               placeholder={strings.pleaseWriteHere}
               onChange={this.onTextChange}
               value={messageText}/>
        <button type="submit" className={style.BoxSceneInput__button}>
          <MdChevronLeft size={styleVar.iconSizeMd} color={styleVar.colorTextLight} style={{margin: "0 4px"}}/>
        </button>
      </form>
    );
  }
}