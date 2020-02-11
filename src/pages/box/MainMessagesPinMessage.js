import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadMessageUnpin} from "../../actions/threadActions";

//components
import Container from "../../../../uikit/src/container";
import {Text} from "../../../../uikit/src/typography";

//styling
import {
  MdClose,
  MdBookmarkOutline,
} from "react-icons/lib/md";
import style from "../../../styles/pages/box/MainMessagesPinMessage.scss";
import styleVar from "../../../styles/variables.scss";
import {decodeEmoji} from "./MainFooterEmojiIcons";
import {messageInfo} from "../../actions/messageActions";


@connect(store => {
  return {};
})
export default class MainMessagesPinMessage extends Component {

  constructor(props) {
    super(props);
    this.onMessageClick = this.onMessageClick.bind(this);
    this.onUnpinClick = this.onUnpinClick.bind(this);
  }
  componentDidMount() {
    this.message = null;
    const {messageVo, thread, dispatch} = this.props;
    dispatch(messageInfo(thread.id, messageVo.messageId)).then(message=>{
      this.message = message;
    })
  }

  onMessageClick() {
    const {messageVo, mainMessageRef} = this.props;
    const {current} = mainMessageRef;
    if(current) {
      current.getWrappedInstance().goToSpecificMessage(this.message.time);
    }
  }

  onUnpinClick(e) {
    e.stopPropagation();
    const {messageVo, dispatch} = this.props;
    dispatch(threadMessageUnpin(messageVo.messageId));
  }

  render() {
    const {messageVo} = this.props;
    return <Container className={style.MainMessagesPinMessage} onClick={this.onMessageClick}>

      <Container centerRight className={style.MainMessagesPinMessage__Message}>
        <Container className={style.MainMessagesPinMessage__MessageIcon}>
          <MdBookmarkOutline size={styleVar.iconSizeMd} color={styleVar.colorAccent}/>
        </Container>
        <Container>
          <Text isHTML>
            {decodeEmoji(messageVo.text)}
          </Text>
        </Container>
      </Container>

      <Container centerLeft className={style.MainMessagesPinMessage__CloseIcon} onClick={this.onUnpinClick}>
        <MdClose size={styleVar.iconSizeMd} color={styleVar.colorTextLight}/>
      </Container>
    </Container>
  }
}