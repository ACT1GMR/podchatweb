// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions

//components
import MainFooterInput from "./MainFooterInput";
import MainFooterAttachment from "./MainFooterAttachment";
import MainFooterEmojiIcons from "./MainFooterEmojiIcons";
import Container from "../../../../uikit/src/container";

//styling
import style from "../../../styles/pages/box/MainFooter.scss";

@connect(store => {
  return {
    emojiShowing: store.threadEmojiShowing
  };
})
export default class MainFooter extends Component {
  constructor(props) {
    super(props);
    this.mainFooterInputRef = React.createRef();
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage() {
    this.mainFooterInputRef.current.getWrappedInstance().sendMessage();
  }

  setInputText(value) {
    this.mainFooterInputRef.current.getWrappedInstance().setInputText(value);
  }

  render() {
    const {emojiShowing} = this.props;
    return (
      <Container className={style.MainFooter}>
        <Container className={style.MainFooter__InputContainer}>
          <Container className={style.MainFooter__Input}>
            <MainFooterInput ref={this.mainFooterInputRef}/>
          </Container>
          <Container className={style.MainFooter__Attachment}>
            <MainFooterAttachment sendMessage={this.sendMessage.bind(this)}/>
          </Container>
        </Container>

        {emojiShowing &&
          <Container className={style.MainFooter__EmojiIconsContainer}>
            <MainFooterEmojiIcons setInputText={this.setInputText.bind(this)}/>
          </Container>
        }
      </Container>
    );
  }
}