// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator} from "../../utils/helpers";
import {withRouter} from "react-router-dom";

//strings
import strings from "../../constants/localization";
import {ROUTE_THREAD} from "../../constants/routes";

//actions
import {threadCreate, threadGetList} from "../../actions/threadActions";

//UI components
import {MdGroup} from "react-icons/lib/md";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import List, {ListItem} from "../../../../uikit/src/list";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Container from "../../../../uikit/src/container";
import LoadingBlinkDots from "../../../../uikit/src/loading/LoadingBlinkDots";
import Loading from "../../../../uikit/src/loading";
import {Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";
import date from "../../utils/date";
import AsideThreadsSearchResult from "./AsideThreadsSearchResult";

//styling
import style from "../../../styles/pages/box/AsideThreads.scss";
import Message from "../../../../uikit/src/message";
import classnames from "classnames";
import styleVar from "../../../styles/variables.scss";

function sliceMessage(message, to) {
  return message;
  //TODO: maybe cause of failure on Aside design due overflow
  /*  const tag = document.createElement("p");
    tag.innerHTML = message;
    const text = tag.innerText;
    const childElementCount = tag.childElementCount * 1.5;
    if (text) {
      if ((text.length + childElementCount) >= 15) {
        return `${text.slice(0, to || 15)}...`;
      }
    }
    return message;*/
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
    if (message.metadata) {
      if (typeof message.metadata === "object") {
        return message.metadata.file;
      }
      return JSON.parse(message.metadata).file
    }
  }
}

function getTitle(title) {
  if (!title) {
    return "";
  }
  if (title.length >= 30) {
    return `${title.slice(0, 30)}...`;
  }
  return title;
}

const sanitizeRule = {
  allowedTags: ["img"],
  allowedAttributes: {
    img: ["src", "style", "class"]
  },
  allowedSchemes: ["data"]
};

@connect(store => {
  return {
    threads: store.threadList.threads,
    threadsFetching: store.threadList.fetching,
    threadId: store.thread.thread.id,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    chatSearchResult: store.chatSearchResult
  };
})
class AsideThreads extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick.bind(this);
    this.state = {activeThread: null};
  }

  onThreadClick(thread) {
    const {chatRouterLess, history} = this.props;
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    this.props.dispatch(threadCreate(null, thread));
  }

  componentDidUpdate(oldProps) {
    const {chatInstance} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      this.props.dispatch(threadGetList());
    }
    if (oldProps.threadId !== this.props.threadId) {
      this.setState({
        activeThread: this.props.threadId
      });
    }
  }

  render() {
    const {threads, threadsFetching, threadShowing, chatInstance, chatSearchResult} = this.props;
    const {activeThread} = this.state;
    const classNames = classnames({
      [style.AsideThreads]: true,
      [style["AsideThreads--isThreadShow"]]: threadShowing
    });
    let filteredThreads = threads;
    if (threadsFetching || !chatInstance) {
      return (
        <section className={classNames}>
          <Loading hasSpace><LoadingBlinkDots invert rtl/></Loading>
        </section>
      )
    } else {
      filteredThreads = filteredThreads.filter(thread => thread.participantCount > 1 || thread.group);
      if (!filteredThreads.length) {
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
          {chatSearchResult ?
            <AsideThreadsSearchResult chatSearchResult={chatSearchResult}/>
            :
            <List>
              {filteredThreads.map(el => (
                <ListItem onSelect={this.onThreadClick.bind(this, el)} selection
                          active={activeThread === el.id}>

                  <Container relative>
                    <Avatar>
                      <AvatarImage src={el.image} customSize="50px" text={avatarNameGenerator(el.title).letter}
                                   textBg={avatarNameGenerator(el.title).color}/>
                      <AvatarName invert>
                        {el.group &&
                        <Container inline>
                          <MdGroup size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                          <Gap x={2}/>
                        </Container>
                        }
                        {getTitle(el.title)}
                        <AvatarText>
                          {el.group ?
                            el.lastMessage || el.lastMessageVO ?
                              <Container>
                                <Text size="sm" inline color="accent">{el.lastParticipantName}: </Text>
                                {isFile(el.lastMessageVO) ?
                                  <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>
                                  :
                                  <Text isHTML size="sm" inline color="gray" dark
                                        sanitizeRule={sanitizeRule}>{sliceMessage(el.lastMessage)}</Text>
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
                                <Text isHTML size="sm" inline color="gray"
                                      sanitizeRule={sanitizeRule}
                                      dark>{sliceMessage(el.lastMessage, 30)}</Text>
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
          }
        </Container>
      );
    }
  }
}

const exportDefault =  withRouter(AsideThreads);
export {getTitle, sliceMessage, isFile, sanitizeRule, prettifyMessageDate, exportDefault as default};