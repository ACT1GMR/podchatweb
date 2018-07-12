// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {sendMessage} from "../../actions/messageActions";
import {getThreadMessageList} from "../../actions/threadActions";

//components

//styling
import style from "../../../styles/pages/box/BoxSceneInput.scss";

@connect(store => {
  return {
    messageSent: store.message.sentMessage,
    threadId: store.thread.thread.id
  };
})
export default class BoxSceneInput extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      messageText: ""
    }
  }

  onFormSubmit(evt) {
    evt.preventDefault();
    this.props.dispatch(sendMessage(this.state.messageText, this.props.threadId));
    this.setState({messageText: ""});
  }

  onTextChange(event) {
    this.setState({messageText: event.target.value});
  }

  render() {
    const {messageText} = this.state;
    return (
      <form className={style.BoxSceneInput} onSubmit={this.onFormSubmit}>
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