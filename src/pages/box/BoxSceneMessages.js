// src/list/BoxSceneMessages
import React, {Component} from "react";
import {connect} from "react-redux";
import "moment/locale/fa";
import date from "../../utils/date";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen} from "../../actions/messageActions";
import {threadMessageGetList} from "../../actions/threadActions";

//components
import List, {ListItem} from "raduikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";
import Paper from "raduikit/src/paper";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import {Text} from "raduikit/src/typography";
import Gap from "raduikit/src/gap";
import BoxSceneMessagesText from "./BoxSceneMessagesText"
import {
  MdDoneAll,
  MdDone,
  MdChatBubbleOutline,
  MdSchedule,
  MdFileUpload
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/BoxSceneMessages.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import BoxSceneMessagesFile from "./BoxSceneMessagesFile";

function isMessageByMe(message, user) {
  if (message) {
    if (message) {
      if (!message.id) {
        return true;
      }
      if (user) {
        return message.participant.id === user.id;
      }
    }
  }
}

function isFile(message) {
  if (message) {
    if (message.metaData) {
      if (typeof message.metaData === "object") {
        return message.metaData.file;
      }
      return JSON.parse(message.metaData).file
    }
  }
}

function datePetrification(time) {
  return date.isToday(time) ? date.format(time, "HH:mm") : date.isWithinAWeek(time) ? date.format(time, "dddd HH:mm") : date.format(time, "YYYY-MM-DD  HH:mm");
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
      showDropZone: false
    };
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
      if (!this.lastMessage || this.lastMessage !== lastMessage.uniqueId) {
        boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
        this.lastMessage = lastMessage.uniqueId;
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

  onDrag(e) {
    const dt = e.dataTransfer;
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
      window.clearTimeout(this.dragTimer);

      this.setState({
        showDropZone: true
      });
    }
  }

  onDrop(e) {
    const dt = e.dataTransfer;
    e.preventDefault();
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
      this.dragTimer;

      this.setState({
        showDropZone: false
      });
    }
  }

  onDragLeave() {
    this.dragTimer = window.setTimeout(() => {
      this.setState({
        showDropZone: false
      });
    }, 25);
  }

  render() {
    const {threadMessagesFetching, threadMessagesPartialFetching, threadMessages, threadFetching, contact, user} = this.props;
    const {showDropZone} = this.state;
    if (threadMessagesFetching || threadFetching) {
      return (
        <Container center>
          <Message
            size="lg">{threadFetching && contact ? strings.creatingChatWith(contact.firstName, contact.lastName) : strings.waitingForMessageFetching}</Message>
          <Loading hasSpace><LoadingBlinkDots/></Loading>
        </Container>
      )
    }
    let partialLoading = "";

    if (!threadMessages.length) {
      return (
        <Container center centerTextAlign relative>
          <div className={style.BoxSceneMessages__Empty}/>
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
    const seenFragment = (el) => {
      if (!isMessageByMe(el, user)) {
        return null;
      }
      if (!el.id) {
        return <MdSchedule size={style.iconSizeXs} style={{margin: "0 5px"}}/>
      }
      if (el.seen) {
        return <MdDoneAll size={style.iconSizeXs} style={{margin: "0 5px"}}/>
      }
      return <MdDone size={style.iconSizeXs} style={{margin: "0 5px"}}/>
    };

    const editFragment = (el) => {
      if (el.edited) {
        return (
          <Gap x={2}>
            <Text italic size="xs" inline>{strings.edited}</Text>
          </Gap>
        )
      }
    };
    const replyFragment = (el) => {
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
    const forwardFragment = (el) => {
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
    const messageArguments = message => {
      return {
        seenFragment,
        editFragment,
        replyFragment,
        forwardFragment,
        isMessageByMe,
        datePetrification,
        message,
        user
      }
    };
    const dropZone = () => {
      return showDropZone ?
        <Container className={style.BoxSceneMessages__DropZone}>
          <Container className={style.BoxSceneMessages__DropZoneText} center centerTextAlign>
            <Message size="lg">{strings.dropYourFileHere}</Message>
            <MdFileUpload size={styleVar.iconSizeXlg} color={styleVar.colorAccent}/>
          </Container>
          <Container className={style.BoxSceneMessages__DropZonePlaceHolder}/>
        </Container>
        : ""
    };
    const message = message => isFile(message) ?
      <BoxSceneMessagesFile {...messageArguments(message)}/>
      :
      <BoxSceneMessagesText {...messageArguments(message)}/>;

    const avatar = message =>
      <Container inline maxWidth="50px" inSpace>
        <Avatar>
          <AvatarImage src={message.participant.image || defaultAvatar}/>
          <AvatarName bottom size="sm">{message.participant.name}</AvatarName>
        </Avatar>
      </Container>;
    return (
      <div className={style.BoxSceneMessages} ref={this.boxSceneMessagesNode} onScroll={this.onScroll}
           onDragOver={this.onDrag.bind(this)} onDragLeave={this.onDragLeave.bind(this)} onDrop={this.onDrop}>
        {dropZone()}
        <List ref={this.messageListNode}>
          {threadMessagesPartialFetching && partialLoading}
          {threadMessages.map(el => (
            <ListItem key={el.id || el.uniqueId} data={el}>
              <Container leftTextAlign={!isMessageByMe(el, user)} inSpace id={`${el.id || el.uniqueId}`}>
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