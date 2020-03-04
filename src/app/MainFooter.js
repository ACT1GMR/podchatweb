// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {mobileCheck} from "../utils/helpers";
//strings

//actions

//components
import MainFooterInput from "./MainFooterInput";
import MainFooterAttachment from "./MainFooterAttachment";
import MainFooterEmojiIcons from "./MainFooterEmojiIcons";
import MainFooterSpam from "./MainFooterSpam";
import Container from "../../../uikit/src/container";

//styling
import style from "../../styles/pages/box/MainFooter.scss";
import MainFooterInputParticipants from "./MainFooterInputParticipants";

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
    this.setInputText = this.setInputText.bind(this);
    this.focusInputNode = this.focusInputNode.bind(this);
  }

  sendMessage() {
    this.mainFooterInputRef.current.getWrappedInstance().sendMessage();
  }

  setInputText(value, append) {
    this.mainFooterInputRef.current.getWrappedInstance().setInputText(value, append);
  }

  focusInputNode() {
    this.mainFooterInputRef.current.getWrappedInstance().focus();
  }

  render() {
    const {emojiShowing} = this.props;
    const classNames = classnames({
      [style.MainFooter]: true,
      [style["MainFooter--isMobile"]]: mobileCheck()
    });
    return (
      <Container className={classNames}>
        <Container className={style.MainFooter__SpamContainer}>
          <MainFooterSpam/>
        </Container>
        <Container className={style.MainFooter__InputContainer}>
          <Container className={style.MainFooter__Attachment}>
            <MainFooterAttachment sendMessage={this.sendMessage.bind(this)}/>
          </Container>
          <Container className={style.MainFooter__Input}>
            <MainFooterInput ref={this.mainFooterInputRef}/>
          </Container>
        </Container>

        {emojiShowing &&
          <Container className={style.MainFooter__EmojiIconsContainer}>
            <MainFooterEmojiIcons setInputText={this.setInputText.bind(this)} focusInputNode={this.focusInputNode.bind(this)}/>
          </Container>
        }
      </Container>
    );
  }
}