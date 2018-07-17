// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {sendMessage, messageEditing, messageEdit} from "../../actions/messageActions";
import {getThreadMessageList} from "../../actions/threadActions";

//components
import Content, {ContentFooter} from "raduikit/src/content";
import Container from "raduikit/src/container";
import {MdClose} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneInput.scss";

@connect(store => {
  return {
    messageSent: store.message.sentMessage,
    messageEditing: store.messageEditing.message,
    messageEdit: store.message.messageEdit,
    threadId: store.thread.thread.id
  };
})
export default class BoxSceneInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onCancelEditing = this.onCancelEditing.bind(this);
    this.state = {
      messageText: ""
    }
  }

  componentDidUpdate(prevProps){
    const {messageEditing} = this.props;
    if(messageEditing){
      if (prevProps.messageEditing !== messageEditing) {
        this.setState({
          messageText: messageEditing.text ? messageEditing.text : ""
        })
      }
    }
  }


  onFormSubmit(msgEditing, evt) {
    evt.preventDefault();
    if (msgEditing) {
      this.props.dispatch(messageEdit(msgEditing.text, msgEditing.id));
    } else {
      this.props.dispatch(sendMessage(this.state.messageText, this.props.threadId));
    }

    this.props.dispatch(messageEditing());
    this.setState({messageText: ""});
  }

  onTextChange(event) {
    this.setState({messageText: event.target.value});
  }

  onCancelEditing(event, id) {
    this.props.dispatch(messageEditing())
  }

  render() {
    const {messageEditing} = this.props;
    const {messageText} = this.state;
    let editingPopup = messageEditing && messageEditing.text ? <Container relative>
      <Content hasBackground={true}>
        {messageEditing.text}
        <Container inline left>
          <MdClose style={{margin: "0 5px"}} onClick={this.onCancelEditing}/>
        </Container>
      </Content>
    </Container> : '';

    return (
      <form className={style.BoxSceneInput} onSubmit={this.onFormSubmit.bind(this, messageEditing)}>
        {editingPopup}
        <input className={style.BoxSceneInput__text}
               type="text"
               placeholder={strings.pleaseWriteHere}
               onChange={this.onTextChange}
               value={messageText}/>
        <button type="submit" className={style.BoxSceneInput__button}> ></button>
      </form>
    );
  }
}