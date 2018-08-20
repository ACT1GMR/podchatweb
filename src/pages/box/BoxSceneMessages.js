// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import "moment/locale/fa";
import date from "../../utils/date";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen, messageEditing} from "../../actions/messageActions";
import {threadModalListShowing, threadMessageGetList} from "../../actions/threadActions";
import {contactListShowing} from "../../actions/contactActions";

//components
import List, {ListItem} from "raduikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";
import Paper, {PaperFooter} from "raduikit/src/paper";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import {Text} from "raduikit/src/typography";
import Gap from "raduikit/src/gap";
import {MdDoneAll, MdDone, MdDelete, MdEdit, MdReply, MdChatBubbleOutline, MdForward} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneMessages.scss";
import utilsStlye from "../../../styles/utils/utils.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";

function isMessageByMe(message, user) {
  if (user) {
    if (message) {
      return message.participant.id === user.id;
    }
  }
}

@connect(store => {
  return {
    threadMessagesHasNext: store.threadMessages.hasNext,
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.fetching,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    user: store.user.user,
    contact: store.contactChatting.contact,
    threadFetching: store.thread.fetching
  };
})
export default class BoxSceneMessages extends Component {

  constructor(props) {
    super(props);
    this.boxSceneMessagesNode = React.createRef();
    this.messageListNode = React.createRef();
    this.onScroll = this.onScroll.bind(this);
    this.seenMessages = [];
    this.state = {
      messageControlShow: false,
      messageControlId: false
    }
  }


  onScroll() {
    const {threadMessages, threadMessagesPartialFetching, threadMessagesHasNext} = this.props;
    if (threadMessagesHasNext) {
      const current = this.boxSceneMessagesNode.current;
      const scrollHeight = current.scrollHeight;
      const scrollTop = current.scrollTop;
      if (scrollTop > this.position) {
        return this.position = scrollTop;
      }
      this.position = scrollTop;
      if (scrollTop <= (scrollHeight / 3)) {
        if (!threadMessagesPartialFetching) {
          this.props.dispatch(threadMessageGetList(threadMessages[0].threadId, (threadMessages.length / 50) * 50));
        }
      }
    }
  }

  componentDidUpdate() {
    let boxSceneMessages = this.boxSceneMessagesNode.current;
    if (boxSceneMessages) {
      const {threadMessages, user} = this.props;
      const lastMessage = threadMessages[threadMessages.length - 1];
      if (!this.lastMessage || this.lastMessage !== lastMessage.id) {
        boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
        this.lastMessage = lastMessage.id;
      }

      if (lastMessage) {
        if (!~this.seenMessages.indexOf(lastMessage.uniqueId)) {
          if (!lastMessage.seen && !isMessageByMe(lastMessage, user)) {
            this.seenMessages.push(lastMessage.uniqueId);
            this.props.dispatch(messageSeen(lastMessage));
          }
        }
      }
    }
  }

  onMouseOver(id) {
    this.setState({
      messageControlShow: true,
      messageControlId: id
    });
  }

  onMouseLeave(id) {
    this.setState({
      messageControlShow: false,
      messageControlId: false
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
    const {threadMessagesFetching, threadMessagesPartialFetching, threadMessages, threadFetching, contact, user} = this.props;
    const {messageControlShow, messageControlId} = this.state;
    if (threadMessagesFetching || threadFetching) {
      return (
        <Container center>
          <Message
            size="lg">{threadFetching && contact ? strings.creatingChatWith(contact.firstName, contact.lastName) : strings.waitingForMessageFetching}</Message>
          <Loading hasSpace><LoadingBlinkDots/></Loading>
        </Container>
      )
    } else {
      let partialLoading = "";
      if (!threadMessages.length) {
        return (
          <Container center centerTextAlign>
            <Message size="lg">{strings.thereIsNoMessageToShow}</Message>
            <MdChatBubbleOutline size={styleVar.iconSizeXlg} color={styleVar.colorAccent}/>
          </Container>
        )
      }
      if (threadMessagesPartialFetching) {
        partialLoading =
          (
            <Container topCenter centerTextAlign>
              <Loading><LoadingBlinkDots size="sm"/></Loading>
            </Container>
          )
      }

      const seenAction = (el) => {
        if (!isMessageByMe(el, user)) {
          return null;
        }
        if (el.seen) {
          return <MdDoneAll size={style.iconSizeXs} style={{margin: "0 5px"}}/>
        }
        return <MdDone size={style.iconSizeXs} style={{margin: "0 5px"}}/>
      };

      const editAction = (el) => {
        if (el.edited) {
          return (
            <Gap x={2}>
              <Text italic size="xs" inline>{strings.edited}</Text>
            </Gap>
          )
        }
      };
      const replyAction = (el) => {
        if (el.replyInfo) {
          return (
            <Text link={`#${el.replyInfo.repliedToMessageId}`}>
              <Paper colorBackground borderRadius={5}>
                <Text bold size="xs">{strings.replyTo}:</Text>
                <Text italic size="xs">{el.replyInfo.repliedToMessage}</Text>
              </Paper>
            </Text>
          )
        }
        return "";
      };
      const forwardAction = (el) => {
        if (el.forwardInfo) {
          return (
            <Paper colorBackground borderRadius={5}>
              <Text italic size="xs">{strings.forwardFrom}</Text>
              <Text bold>{el.forwardInfo.participant.name}:</Text>
            </Paper>
          )
        }
        return "";
      };
      const iconClasses = `${utilsStlye["u-clickable"]} ${utilsStlye["u-hoverColorAccent"]}`;
      const message = el =>
        <Container inline inSpace relative maxWidth="50%" minWidth="220px"
                   onMouseOver={this.onMouseOver.bind(this, el.id)}
                   onMouseLeave={this.onMouseLeave.bind(this, el.id)}>
          <Paper colorBackgroundLight borderRadius={5}>
            {replyAction(el)}
            {forwardAction(el)}
            <Text>
              {el.message}
            </Text>
            <PaperFooter>
              {seenAction(el)}
              {editAction(el)}
              {date.isToday(el.time) ? date.format(el.time, "HH:mm") : date.isWithinAWeek(el.time) ? date.format(el.time, "dddd HH:mm") : date.format(el.time, "YYYY-MM-DD  HH:mm")}
              {messageControlShow && el.id === messageControlId ?
                <Container inline left={isMessageByMe(el, user)} right={!isMessageByMe(el, user)} inSpace>
                  {isMessageByMe(el, user) &&
                  <Container inline>
                    {el.editable && <MdEdit style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                            className={iconClasses}
                                            onClick={this.onEdit.bind(this, el.id, el.message)}/>}
                    {el.deletable && <MdDelete style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                                               className={iconClasses}
                                               onClick={this.onDelete.bind(this, el.id)}/>}
                  </Container>
                  }
                  <MdForward style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                             className={iconClasses}
                             onClick={this.onForward.bind(this, el)}/>
                  <MdReply style={{margin: "0 5px"}} size={styleVar.iconSizeSm}
                           className={iconClasses}
                           onClick={this.onReply.bind(this, el.id, el.message)}/>
                </Container> : ""
              }
            </PaperFooter>
          </Paper>
        </Container>;
      const avatar = el =>
        <Container inline maxWidth="50px" inSpace>
          <Avatar>
            <AvatarImage src={el.participant.image || defaultAvatar}/>
            <AvatarName bottom size="sm">{el.participant.name}</AvatarName>
          </Avatar>
        </Container>;
      return (
        <div className={style.BoxSceneMessages} ref={this.boxSceneMessagesNode} onScroll={this.onScroll}>
          <List ref={this.messageListNode}>
            {threadMessagesPartialFetching && partialLoading}
            {threadMessages.map(el => (
              <ListItem key={el.id} data={el}>
                <Container leftTextAlign={!isMessageByMe(el, user)} inSpace id={el.id}>
                  {!isMessageByMe(el, user) ? message(el) : avatar(el)}
                  {!isMessageByMe(el, user) ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
  }
}