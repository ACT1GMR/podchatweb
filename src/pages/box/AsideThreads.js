// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization";

//actions
import {threadCreate, threadGetList, threadShowing} from "../../actions/threadActions";

//UI components
import Avatar, {AvatarImage, AvatarName, AvatarText} from "raduikit/src/avatar";
import List, {ListItem} from "raduikit/src/list";
import Shape, {ShapeCircle} from "raduikit/src/shape";
import Container from "raduikit/src/container";
import LoadingBlinkDots from "raduikit/src/loading/LoadingBlinkDots";
import Loading from "raduikit/src/loading";
import {Text} from "raduikit/src/typography";
import Gap from "raduikit/src/gap";
import date from "../../utils/date";

//styling
import style from "../../../styles/pages/box/AsideThreads.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png";
import Message from "raduikit/src/message";
import classnames from "classnames";

function sliceMessage(message, to) {
  if (message) {
    if (message.length >= 15) {
      return `${message.slice(0, to || 15)}...`;
    }
  }
  return message;
}

function prettifyMessageDate(passedTime) {
  const diff = Date.now() - passedTime;
  const isToday = date.isToday(passedTime);
  if (isToday) {
    return date.format(passedTime, "HH:mm", "en")
  }
  return date.prettifySince(diff);
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
function getTitle(title) {
  if(title.length >= 30) {
    return `${title.slice(0, 30)}...`;
  }
  return title;
}

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadsFetching: store.threadList.fetching,
    threadId: store.thread.thread.id
  };
})
export default class AsideThreads extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick.bind(this);
    this.state = {activeThread: null};
  }

  componentDidMount() {
    this.props.dispatch(threadGetList());

  }

  onThreadClick(thread) {
    this.props.dispatch(threadCreate(null, thread));
    this.props.dispatch(threadShowing(true));
  }

  componentDidUpdate(oldProps) {
    if (oldProps.threadId !== this.props.threadId) {
      this.setState({
        activeThread: this.props.threadId
      });
    }
  }

  render() {
    const {threads, threadsFetching, threadShowing} = this.props;
    const {activeThread} = this.state;
    const classNames = classnames({
      [style.AsideThreads]: true,
      [style["AsideThreads--isThreadShow"]]: threadShowing
    });
    if (threadsFetching) {
      return (
        <section className={classNames}>
          <Loading hasSpace><LoadingBlinkDots invert rtl/></Loading>
        </section>
      )
    } else {
      if (!threads.length) {
        return (
          <section className={classNames}>
            <Container center centerTextAlign>
              <Message invert size="lg">{strings.thereIsNoChat}</Message>
            </Container>
          </section>
        )
      }
      return (
        <Container className={classNames}>
          <List>
            {threads.map(el => (
              <ListItem key={el.id} onSelect={this.onThreadClick.bind(this, el)} selection
                        active={activeThread === el.id}>

                <Container relative>
                  <Avatar>
                    <AvatarImage src={el.lastParticipantImage ? el.lastParticipantImage : defaultAvatar} customSize="50px"/>
                    <AvatarName invert>
                      {getTitle(el.title)}
                      <AvatarText>
                        {el.group ?
                          el.lastMessage || el.lastMessageVO ?
                            <Container>
                              <Text size="sm" inline color="accent">{el.lastParticipantName}: </Text>
                              {isFile(el.lastMessageVO) ?
                                <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                                :
                                <Text size="sm" inline color="gray" dark>{sliceMessage(el.lastMessage)}</Text>
                              }
                            </Container>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAGroup(el.lastParticipantName), 30)}</Text>
                          :
                          el.lastMessage || el.lastMessageVO ?
                            isFile(el.lastMessageVO) ?
                              <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                              :
                              <Text size="sm" inline color="gray" dark>{sliceMessage(el.lastMessage, 30)}</Text>
                            :
                            <Text size="sm" inline
                                  color="accent">{sliceMessage(strings.createdAChat(el.lastParticipantName), 35)}</Text>
                        }
                        {el.lastMessageVO || el.time ?
                          <Container topLeft>
                            <Text size="xs"
                                  color="gray">{prettifyMessageDate(el.time || el.lastMessageVO.time)}</Text>
                          </Container>
                          : ""}

                      </AvatarText>
                    </AvatarName>
                  </Avatar>
                  {el.unreadCount && activeThread !== el.id ?
                    <Container absolute centerLeft>
                      <Gap y={10} block/>
                      <Shape color="accent">
                        <ShapeCircle>{el.unreadCount}</ShapeCircle>
                      </Shape>
                    </Container> : ""}
                </Container>
              </ListItem>
            ))}
          </List>
        </Container>
      );
    }
  }
}
