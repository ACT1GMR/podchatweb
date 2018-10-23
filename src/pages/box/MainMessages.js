// src/list/BoxSceneMessages
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import "moment/locale/fa";
import date from "../../utils/date";

//strings
import strings from "../../constants/localization";

//actions
import {messageSeen} from "../../actions/messageActions";
import {
  threadFilesToUpload,
  threadMessageGetListByMessageId,
  threadMessageGetListPartial,
  threadMessageGetList
} from "../../actions/threadActions";

//components
import {ButtonFloating} from "raduikit/src/button"
import List, {ListItem} from "raduikit/src/list"
import Avatar, {AvatarImage, AvatarName} from "raduikit/src/avatar";
import Loading, {LoadingBlinkDots} from "raduikit/src/loading";
import Paper from "raduikit/src/paper";
import Container from "raduikit/src/container";
import Message from "raduikit/src/message";
import {Text} from "raduikit/src/typography";
import Gap from "raduikit/src/gap";
import MainMessagesFile from "./MainMessagesFile";
import MainMessagesText from "./MainMessagesText"
import {
  MdDoneAll,
  MdDone,
  MdChatBubbleOutline,
  MdErrorOutline,
  MdSchedule,
  MdExpandMore
} from "react-icons/lib/md";

//styling
import style from "../../../styles/pages/box/MainMessages.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import styleVar from "./../../../styles/variables.scss";
import classnames from "classnames";

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

function hiddenLastOwner(message, threadMessages) {
  const msgOwnerId = message.participant.id;
  const msgId = message.id;
  const index = threadMessages.findIndex(e => e.id === msgId);
  if (~index) {
    const lastMessage = threadMessages[index - 1];
    if (lastMessage) {
      if (lastMessage.participant.id === msgOwnerId) {
        return "hidden";
      }
    }
    return "visible";
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
    threadId: store.thread.thread.id,
    threadMessages: store.threadMessages.messages,
    threadMessagesHasNext: store.threadMessages.hasNext,
    threadMessagesHasPrevious: store.threadMessages.hasPrevious,
    threadMessagesFetching: store.threadMessages.fetching,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    threadGetMessageListByMessageIdFetching: store.threadGetMessageListByMessageId.fetching,
    threadGoToMessageId: store.threadGoToMessageId,
    threadFetching: store.thread.fetching,
    user: store.user.user,
    contact: store.contactChatting.contact
  };
})
export default class MainMessages extends Component {
  seenMessages = [];
  lastMessage = null;
  gotoBottom = true;
  freeScroll = true;
  lastPosition = null;

  constructor(props) {
    super(props);
    this.boxSceneMessagesNode = React.createRef();
    this.messageListNode = React.createRef();
    this.onScroll = this.onScroll.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onGotoBottom = this.onGotoBottom.bind(this);
    this.state = {
      highLightMessage: null,
      gotoBottomButtonShowing: false
    };
  }

  onGotoBottom() {
    const {dispatch, threadId, threadMessagesHasNext} = this.props;
    const {gotoBottomButtonShowing} = this.state;
    if (threadMessagesHasNext) {
      dispatch(threadMessageGetList(threadId));
      this.gotoBottom = true;
    } else {
      let messagesNode = ReactDOM.findDOMNode(this.boxSceneMessagesNode.current);
      messagesNode.scrollTop = messagesNode.scrollHeight;
    }
    if (gotoBottomButtonShowing) {
      this.setState({
        gotoBottomButtonShowing: false
      });
    }
  }

  onScroll() {
    const {threadMessages, threadMessagesPartialFetching, threadMessagesHasNext, threadMessagesHasPrevious} = this.props;
    const {gotoBottomButtonShowing} = this.state;
    if (!this.freeScroll || threadMessagesPartialFetching) {
      return false;
    }
    const current = ReactDOM.findDOMNode(this.boxSceneMessagesNode.current);
    const scrollTop = current.scrollTop + current.offsetHeight;
    const goingToUp = scrollTop < this.lastPosition;
    const scrollHeight = current.scrollHeight;
    const gotoBottomButtonShowingThreshold = 100;
    if ((scrollHeight - gotoBottomButtonShowingThreshold) >= scrollTop) {
      if (!goingToUp || threadMessagesHasNext) {
        if (!gotoBottomButtonShowing) {
          this.setState({
            gotoBottomButtonShowing: true
          });
        }
      } else {
        if (gotoBottomButtonShowing) {
          this.setState({
            gotoBottomButtonShowing: false
          });
        }
      }
    } else {
      if (gotoBottomButtonShowing) {
        this.setState({
          gotoBottomButtonShowing: false
        });
      }
    }
    if (threadMessagesHasPrevious || threadMessagesHasNext) {
      this.lastPosition = scrollTop;
      let message;
      let loadBefore = false;
      if (goingToUp) {
        if (threadMessagesHasPrevious) {
          if (scrollTop <= (scrollHeight / 3)) {
            message = threadMessages[0];
            loadBefore = true;
          }
        }
      } else {
        if (threadMessagesHasNext) {
          if (scrollTop > (scrollHeight - (scrollHeight / 3))) {
            message = threadMessages[threadMessages.length - 1];
          }
        }
      }
      if (message) {
        this.props.dispatch(threadMessageGetListPartial(message.threadId, message.id, loadBefore, 50));
      }
    }
  }

  componentDidUpdate(oldProps) {
    let messagesNode = ReactDOM.findDOMNode(this.boxSceneMessagesNode.current);
    if (messagesNode) {
      const {threadMessages, user, threadId, threadGoToMessageId} = this.props;
      const {threadId: oldThreadId, threadGoToMessageId: oldThreadGoToMessageId, threadMessages: oldThreadMessages} = oldProps;
      const lastMessage = threadMessages[threadMessages.length - 1];
      const gotoBottom = () => {
        messagesNode.scrollTop = messagesNode.scrollHeight;
        this.lastMessage = lastMessage.uniqueId;
        if (lastMessage) {
          if (!~this.seenMessages.indexOf(lastMessage.uniqueId)) {
            if (!lastMessage.seen && !isMessageByMe(lastMessage, user)) {
              this.seenMessages.push(lastMessage.uniqueId);
              this.props.dispatch(messageSeen(lastMessage));
            }
          }
        }
      };
      if (this.pendingGoToId) {
        this.gotoMessage(this.pendingGoToId);
        this.freeScroll = false;
      } else if (this.gotoBottom) {
        if (oldThreadMessages !== threadMessages) {
          if (threadMessages) {
            gotoBottom();
          }
          this.gotoBottom = false;
        }
      } else if (oldProps.threadGoToMessageId !== threadGoToMessageId) {
        return this.goToMessageId(threadGoToMessageId.threadId, threadGoToMessageId.messageId);
      } else {
        if (oldThreadId !== threadId) {
          this.gotoBottom = true;
        } else if (lastMessage.newMessage && this.lastMessage !== lastMessage.uniqueId) {
          gotoBottom();
        }
      }
    }
  }

  gotoMessage(pendingGoToId) {
    if (pendingGoToId) {
      const index = this.props.threadMessages.findIndex(e => e.id === pendingGoToId);
      if (~index) {
        document.getElementById(pendingGoToId).scrollIntoView();
        this.pendingGoToId = null;
        this.setState({
          highLightMessage: pendingGoToId
        });
        setTimeout(() => {
          this.setState({
            highLightMessage: false
          });
        }, 2500);
        setTimeout(() => {
          this.freeScroll = true;
        }, 1500);
      }
    }
  }

  goToMessageId(threadId, msgId) {
    const {threadMessages} = this.props;
    const index = threadMessages.findIndex(e => e.id === msgId);
    if (~index) {
      return this.gotoMessage(msgId);
    }
    this.pendingGoToId = msgId;
    this.props.dispatch(threadMessageGetListByMessageId(threadId, msgId));
  }

  onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnter(e) {
    e.stopPropagation();
  }

  onFileDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
      this.props.dispatch(threadFilesToUpload(dt.files));
    }
    return false;
  }

  render() {
    const {threadGetMessageListByMessageIdFetching, threadMessagesFetching, threadMessagesPartialFetching, threadMessages, threadFetching, contact, user} = this.props;
    const {highLightMessage, gotoBottomButtonShowing} = this.state;
    if (threadMessagesFetching || threadFetching || threadGetMessageListByMessageIdFetching) {
      return (
        <Container className={style.MainMessages}>
          <Container center centerTextAlign style={{width: "100%"}}>
            <Message
              size="lg">{threadFetching && contact ? strings.creatingChatWith(contact.firstName, contact.lastName) : strings.waitingForMessageFetching}</Message>
            <Loading hasSpace><LoadingBlinkDots/></Loading>
          </Container>
        </Container>
      )
    }
    let partialLoading = "";

    if (!threadMessages.length) {
      return (
        <Container className={style.MainMessages}>
          <Container center centerTextAlign relative style={{width: "100%"}}>
            <div className={style.MainMessages__Empty}/>
            <Message size="lg">{strings.thereIsNoMessageToShow}</Message>
            <MdChatBubbleOutline size={styleVar.iconSizeXlg} color={styleVar.colorAccent}/>
          </Container>
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
    const seenFragment = (el, onClick) => {
      if (!isMessageByMe(el, user)) {
        return null;
      }
      if (el.hasError) {
        return (
          <Container inline>
            <MdErrorOutline size={style.iconSizeXs} style={{margin: "0 5px"}}/>
            <Gap x={2}>
              <Container onClick={onClick}>
                <Text size="xs" color="accent" linkStyle>{strings.tryAgain}</Text>
              </Container>
            </Gap>
            <Gap x={3}/>
          </Container>
        )
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
          <Container onClick={this.goToMessageId.bind(this, el.threadId, el.replyInfo.repliedToMessageId)}>
            <Paper colorBackground borderRadius={5}>
              <Text bold size="xs">{strings.replyTo}:</Text>
              <Text italic size="xs">{el.replyInfo.repliedToMessage}</Text>
            </Paper>
            <Gap block y={5}/>
          </Container>
        )
      }
      return "";
    };
    const forwardFragment = (el) => {
      if (el.forwardInfo) {
        return (
          <Container>
            <Paper colorBackground borderRadius={5}>
              <Text italic size="xs">{strings.forwardFrom}</Text>
              <Text bold>{el.forwardInfo.participant.name}:</Text>
            </Paper>
            <Gap block y={5}/>
          </Container>
        )
      }
      return "";
    };

    const highLighterFragment = message => {
      const classNames = classnames({
        [style.MainMessages__Highlighter]: true,
        [style["MainMessages__Highlighter--highlighted"]]: highLightMessage && highLightMessage === message.id
      });
      return (
        <Container className={classNames}>
          <Container className={style.MainMessages__HighlighterBox}/>
        </Container>
      );
    };

    const messageArguments = message => {
      return {
        highLighterFragment,
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

    const message = message => isFile(message) ?
      <MainMessagesFile {...messageArguments(message)}/>
      :
      <MainMessagesText {...messageArguments(message)}/>;

    const avatar = message =>
      <Container inline inSpace style={{visibility: hiddenLastOwner(message, threadMessages), maxWidth: "50px"}}>
        <Avatar>
          <AvatarImage src={message.participant.image || defaultAvatar}/>
          <AvatarName bottom size="sm">{message.participant.name}</AvatarName>
        </Avatar>
      </Container>;

    return (
      <Container className={style.MainMessages} onScroll={this.onScroll}
                 onDragEnter={this.onDragEnter}
                 onDragOver={this.onDragOver}
                 onDrop={this.onFileDrop}>
        {threadMessagesPartialFetching && partialLoading}
        <Container className={style.MainMessages__Messages}
                   ref={this.boxSceneMessagesNode}>
          <List ref={this.messageListNode}>
            {threadMessages.map(el => (
              <ListItem key={el.id || el.uniqueId} data={el}>
                <Container leftTextAlign={!isMessageByMe(el, user)} inSpace id={`${el.id || el.uniqueId}`}>
                  {!isMessageByMe(el, user) ? message(el) : avatar(el)}
                  {!isMessageByMe(el, user) ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </Container>
        {gotoBottomButtonShowing ?
          <ButtonFloating onClick={this.onGotoBottom} size="sm" position={{right: 0, bottom: 0}}>
            <MdExpandMore size={style.iconSizeMd} style={{margin: "0 5px"}}/>
          </ButtonFloating> :
          ""}

      </Container>
    );
  }
}