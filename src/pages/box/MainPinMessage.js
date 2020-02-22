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
  MdLocalOffer,
  MdVideocam
} from "react-icons/md";
import style from "../../../styles/pages/box/MainMessagesPinMessage.scss";
import styleVar from "../../../styles/variables.scss";
import {decodeEmoji} from "./MainFooterEmojiIcons";
import {messageInfo} from "../../actions/messageActions";
import {getMessageEditingText} from "./MainFooterInputEditing";
import {isOwner} from "./ModalThreadInfoGroupMain";


@connect(store => {
  return {
    user: store.user.user
  };
})
export default class MainPinMessage extends Component {

  constructor(props) {
    super(props);
    this.onMessageClick = this.onMessageClick.bind(this);
    this.onUnpinClick = this.onUnpinClick.bind(this);
    this.state = {
      message: null
    };
  }

  componentDidMount() {
    this.requestForMessage();
  }

  componentDidUpdate({messageVo: oldMessageVo}) {
    if (oldMessageVo.messageId !== this.props.messageVo.messageId) {
      this.requestForMessage();
    } else {
      if (oldMessageVo.text !== this.props.messageVo.text) {
        this.requestForMessage();
      }
    }
  }

  requestForMessage() {
    this.setState({
      message: null
    });
    const {messageVo, thread, dispatch} = this.props;
    dispatch(messageInfo(thread.id, messageVo.messageId)).then(message => this.setState({message}));
  }

  onMessageClick() {
    const {messageVo, mainMessageRef} = this.props;
    const {message} = this.state;
    const {current} = mainMessageRef;
    if (current) {
      current.getWrappedInstance().goToSpecificMessage(message.time);
    }
  }

  onUnpinClick(e) {
    e.stopPropagation();
    const {messageVo, dispatch} = this.props;
    dispatch(threadMessageUnpin(messageVo.messageId));
  }

  render() {
    const {user, thread} = this.props;
    const {message} = this.state;
    const messageDetails = message ? getMessageEditingText(message) : {};
    return <Container className={style.MainPinMessage} onClick={this.onMessageClick}>

      <Container className={style.MainPinMessage__Message}>
        <Container className={style.MainPinMessage__MessageIcon}>
          <MdLocalOffer size={styleVar.iconSizeSm} color={styleVar.colorAccent}/>
        </Container>

        <Container className={style.MainPinMessage__MessageDetails}>
          {messageDetails.image &&
          <Container className={style.MainPinMessage__ImageContainer} inline>
            <Container className={style.MainPinMessage__Image}
                       style={{backgroundImage: `url(${messageDetails.image})`}}/>
          </Container>
          }
          {
            messageDetails.isVideo &&
            <MdVideocam size={styleVar.iconSizeSm} color={styleVar.colorAccent}
                        style={{marginLeft: "5px", marginTop: "3px"}}/>
          }
          <Text isHTML>
            {decodeEmoji(messageDetails.text)}
          </Text>
        </Container>
      </Container>
      {isOwner(thread, user) && <Container className={style.MainPinMessage__CloseIcon} onClick={this.onUnpinClick}>
        <MdClose size={styleVar.iconSizeMd} color={styleVar.colorTextLight}/>
      </Container>}

    </Container>
  }
}