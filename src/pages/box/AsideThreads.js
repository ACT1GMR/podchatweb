// src/list/Avatar.scss.js
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {avatarNameGenerator, getNow} from "../../utils/helpers";
import {withRouter} from "react-router-dom";
import {isFile} from "./MainMessagesMessage";
import {isMessageByMe} from "./MainMessages";
import {decodeEmoji} from "./MainFooterEmojiIcons";
import {isGroup, isChannel} from "./Main";


//strings
import {
  MdBookmarkOutline,
} from "react-icons/lib/md";
import strings from "../../constants/localization";
import {ROUTE_THREAD} from "../../constants/routes";

//actions
import {
  threadCreateWithExistThread, threadCreateWithUser,
  threadGetList,
  threadLeave,
  threadModalThreadInfoShowing, threadNotification, threadPinToTop, threadUnpinFromTop
} from "../../actions/threadActions";

//UI components
import AsideThreadsSearchResult from "./AsideThreadsSearchResult";
import {TypingFragment} from "./MainHeadThreadInfo";
import {MdGroup, MdRecordVoiceOver, MdDoneAll, MdDone} from "react-icons/lib/md";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../../uikit/src/avatar";
import List, {ListItem} from "../../../../uikit/src/list";
import Scroller from "../../../../uikit/src/scroller";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Container from "../../../../uikit/src/container";
import LoadingBlinkDots from "../../../../uikit/src/loading/LoadingBlinkDots";
import Loading from "../../../../uikit/src/loading";
import {Text} from "../../../../uikit/src/typography";
import Gap from "../../../../uikit/src/gap";
import date from "../../utils/date";

//styling
import style from "../../../styles/pages/box/AsideThreads.scss";
import Message from "../../../../uikit/src/message";
import classnames from "classnames";
import styleVar from "../../../styles/variables.scss";
import Context, {ContextItem, ContextTrigger} from "../../../../uikit/src/menu/Context";
import {chatModalPrompt, chatSearchResult} from "../../actions/chatActions";
import {contactChatting} from "../../actions/contactActions";

function sliceMessage(message, to) {
  return decodeEmoji(message);
}

function prettifyMessageDate(passedTime) {
  const diff = getNow() - passedTime;
  const isToday = date.isToday(passedTime);
  if (isToday) {
    return date.format(passedTime, "HH:mm", "en")
  }
  return date.prettifySince(diff);
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


function LastMessageTextFragment({isGroup, isChannel, lastMessageVO, lastMessage, inviter, isTyping}) {
  const isFileReal = isFile(lastMessageVO);
  const hasLastMessage = lastMessage || lastMessageVO;
  const isTypingReal = isTyping && isTyping.isTyping;
  const isTypingUserName = isTyping && isTyping.user.user;

  const sentAFileFragment = <Text size="sm" inline color="gray" dark>{strings.sentAFile}</Text>;
  const lastMessageFragment = <Text isHTML size="sm" inline color="gray"
                                    sanitizeRule={sanitizeRule}
                                    dark>{sliceMessage(lastMessage, 30)}</Text>;
  const createdAThreadFragment = <Text size="sm" inline
                                       color="accent">{sliceMessage(strings.createdAThread(inviter && (inviter.contactName || inviter.name), isGroup, isChannel), 30)}</Text>;

  return (
    <Container> {
      isTypingReal ? <TypingFragment isGroup={isGroup || isChannel} typing={isTyping}
                                     textProps={{size: "sm", color: "yellow", dark: true}}/> :
        isGroup && !isChannel ?
          hasLastMessage ?
            <Container>
              <Container inline>
                <Text size="sm" inline
                      color="accent">{isTypingReal ? isTypingUserName : lastMessageVO.participant && (lastMessageVO.participant.contactName || lastMessageVO.participant.name)}:</Text>
              </Container>
              {isFileReal ? sentAFileFragment : lastMessageFragment}
            </Container>
            :
            createdAThreadFragment
          :
          hasLastMessage ? isFileReal ? sentAFileFragment : lastMessageFragment : createdAThreadFragment
    }
    </Container>
  )
}

function LastMessageInfoFragment({isGroup, isChannel, time, lastMessageVO, isMessageByMe}) {
  return (
    <Container>
      <Container topLeft>
        {
          lastMessageVO && !isGroup && !isChannel && isMessageByMe &&
          <Container inline>
            {lastMessageVO.seen ? <MdDoneAll size={style.iconSizeSm} color={style.colorAccent}/> :
              <MdDone size={style.iconSizeSm} color={style.colorAccent}/>}
            <Gap x={3}/>
          </Container>
        }
        <Container inline>
          <Text size="xs"
                color="gray">{prettifyMessageDate(time || lastMessageVO.time)}</Text>
        </Container>

      </Container>

    </Container>
  )
}

export function LastMessageFragment({thread, user}) {
  const {group, type, lastMessageVO, lastMessage, inviter, time, isTyping} = thread;
  const args = {
    isGroup: group && type !== 8,
    isChannel: group && type === 8,
    lastMessageVO,
    lastMessage,
    inviter,
    time,
    isTyping,
    isMessageByMe: isMessageByMe(lastMessageVO, user)
  };
  return (
    <Container>
      <LastMessageTextFragment {...args}/>
      <LastMessageInfoFragment {...args}/>
    </Container>
  )
}

function PartialLoadingFragment() {
  return (
    <Container bottomCenter centerTextAlign style={{zIndex: 1}}>
      <Loading><LoadingBlinkDots size="sm" invert/></Loading>
    </Container>
  )
}


const sanitizeRule = {
  allowedTags: ["img"],
  allowedAttributes: {
    img: ["src", "style", "class"]
  },
  allowedSchemes: ["data"]
};

export const statics = {
  count: 50
};

@connect(store => {
  return {
    threads: store.threads.threads,
    threadsFetching: store.threads.fetching,
    threadsHasNext: store.threads.hasNext,
    threadsNextOffset: store.threads.nextOffset,
    threadsPartialFetching: store.threadsPartial.fetching,
    threadId: store.thread.thread.id,
    chatInstance: store.chatInstance.chatSDK,
    chatRouterLess: store.chatRouterLess,
    chatSearchResult: store.chatSearchResult,
    user: store.user.user
  };
})
class AsideThreads extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick = this.onThreadClick.bind(this);
    this.onStartChat = this.onStartChat.bind(this);
    this.onScrollBottomThreshold = this.onScrollBottomThreshold.bind(this);
    this.onLeaveClick = this.onLeaveClick.bind(this);
    this.onPinClick = this.onPinClick.bind(this);
    this.onMuteClick = this.onMuteClick.bind(this);
    this.state = {activeThread: null};
  }

  onThreadClick(thread, e) {
    const {chatRouterLess, history, threadId, dispatch} = this.props;
    if (e.nativeEvent.which === 3) {
      e.preventDefault();
      return true;
    }
    if (thread.id === threadId) {
      return true;
    }
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    dispatch(threadCreateWithExistThread(thread));
  }

  onStartChat(contact) {
    const {history, chatRouterLess, dispatch} = this.props;
    dispatch(contactChatting(contact));
    dispatch(threadCreateWithUser(contact.id));
    if (!chatRouterLess) {
      history.push(ROUTE_THREAD);
    }
    dispatch(chatSearchResult());
  }

  componentDidUpdate(oldProps) {
    const {chatInstance, dispatch} = this.props;
    if (oldProps.chatInstance !== chatInstance) {
      dispatch(threadGetList(0, statics.count));
    }
    if (oldProps.threadId !== this.props.threadId) {
      this.setState({
        activeThread: this.props.threadId
      });
    }
  }

  onLeaveClick(thread) {
    const {dispatch} = this.props;
    dispatch(chatModalPrompt(true, `${isChannel(thread) || isGroup(thread) ? strings.areYouSureAboutLeavingGroup(isChannel(thread)) : strings.areYouSureRemovingThread}؟`, () => {
      dispatch(threadLeave(thread.id));
      dispatch(threadModalThreadInfoShowing());
      dispatch(chatModalPrompt());
    }, null, strings.leave));
  }

  onMuteClick(thread) {
    const {dispatch} = this.props;
    dispatch(threadNotification(thread.id, !thread.mute));
  }

  onPinClick(thread) {
    const {dispatch} = this.props;
    dispatch(thread.pin ? threadUnpinFromTop(thread.id) : threadPinToTop(thread.id));
  }

  onScrollBottomThreshold() {
    const {threadsNextOffset, dispatch} = this.props;
    dispatch(threadGetList(threadsNextOffset, statics.count));
  }

  render() {
    const {threads, threadsFetching, threadShowing, chatInstance, chatSearchResult, user, threadsHasNext, threadsPartialFetching} = this.props;
    const {activeThread} = this.state;
    const classNames = classnames({
      [style.AsideThreads]: true,
      [style["AsideThreads--isThreadShow"]]: threadShowing
    });
    let filteredThreads = threads;
    let filteredContacts;
    let isSearchResult;
    if (chatSearchResult) {
      isSearchResult = true;
      filteredThreads = chatSearchResult.filteredThreads;
      filteredContacts = chatSearchResult.filteredContacts;
      if (filteredContacts) {
        filteredContacts = filteredContacts.filter(e => e.linkedUser);
      }
    }
    let pinedThread = threads.filter(e => e.pin);
    if (threadsFetching || !chatInstance || !user.id) {
      return (
        <section className={classNames}>
          <Loading hasSpace><LoadingBlinkDots invert rtl/></Loading>
        </section>
      )
    } else {
      //filteredThreads = filteredThreads.filter(thread => thread.participantCount > 1 || thread.group);

      if (!filteredThreads.length) {
        return (
          <section className={classNames}>
            <Container center centerTextAlign>
              <Message invert size="lg">{strings.thereIsNoChat}</Message>
            </Container>
          </section>
        )
      }
      const threadsContainerClassNames = classnames({
        [style.AsideThreads__Threads]: true,
        [style["AsideThreads__ThreadsFullHeight"]]: !isSearchResult
      });
      return (
        <Scroller className={classNames}>
          <Fragment>
            <Fragment>
              {isSearchResult &&
              <Gap y="8" x="5">
                <Text bold color="accent">{strings.conversations}</Text>
              </Gap>
              }
              <Scroller className={threadsContainerClassNames}
                        threshold={5}
                        onScrollBottomThresholdCondition={threadsHasNext && !threadsPartialFetching}
                        onScrollBottomThreshold={this.onScrollBottomThreshold}>
                <List>
                  {filteredThreads.map(el => (
                    <Fragment>
                      <Context id={el.id} rtl>

                        {
                          <ContextItem onClick={this.onThreadClick.bind(null, el)}>
                            {strings.openThread}
                          </ContextItem>
                        }

                        {
                          <ContextItem onClick={this.onLeaveClick.bind(null, el)}>
                            {(isGroup(el) || isChannel(el)) ? strings.leave : strings.remove}
                          </ContextItem>
                        }

                        {
                          <ContextItem onClick={this.onMuteClick.bind(null, el)}>
                            {el.mute ? strings.unmute : strings.mute}
                          </ContextItem>
                        }

                        {
                          ((el.pin && pinedThread.length >= 5) || pinedThread.length < 5) &&
                          <ContextItem onClick={this.onPinClick.bind(null, el)}>
                            {el.pin || pinedThread.length >= 5 ? strings.unpinFromTop : strings.pinToTop}
                          </ContextItem>
                        }

                      </Context>
                      <ContextTrigger id={el.id} holdToDisplay={-1}>

                        <ListItem key={el.id} onSelect={this.onThreadClick.bind(this, el)} selection
                                  active={activeThread === el.id}>
                          <Container relative>
                            <Avatar className={style.AsideThreads__AvatarContainer}>
                              <AvatarImage src={el.image} customSize="50px" text={avatarNameGenerator(el.title).letter}
                                           textBg={avatarNameGenerator(el.title).color}/>
                              <AvatarName invert>
                                {el.group &&
                                <Container inline>
                                  {el.type === 8 ?
                                    <MdRecordVoiceOver size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                                    :
                                    <MdGroup size={styleVar.iconSizeSm} color={styleVar.colorGray}/>
                                  }
                                  <Gap x={2}/>
                                </Container>
                                }
                                {getTitle(el.title)}
                                <AvatarText>
                                  <LastMessageFragment thread={el} user={user}/>
                                </AvatarText>
                              </AvatarName>
                            </Avatar>
                            {el.unreadCount || el.pin ?
                              <Container absolute centerLeft>
                                <Gap y={10} block/>
                                {el.mentioned &&
                                <Fragment>
                                  <Shape color="accent">
                                    <ShapeCircle>@</ShapeCircle>
                                  </Shape>
                                  <Gap x={1}/>
                                </Fragment>
                                }
                                {el.unreadCount ?
                                  <Shape color="accent">
                                    <ShapeCircle>{el.unreadCount}</ShapeCircle>
                                  </Shape> :
                                  el.pin ?
                                    <MdBookmarkOutline size={styleVar.iconSizeXs} color={styleVar.colorAccent}/> : ""
                                }
                              </Container> : ""}
                          </Container>
                        </ListItem>
                      </ContextTrigger>
                    </Fragment>
                  ))}
                </List>
                {threadsPartialFetching && <PartialLoadingFragment/>}

              </Scroller>
            </Fragment>
            {isSearchResult &&
            <Fragment>
              <Gap y="8" x="5">
                <Text bold color="accent">{strings.contacts}</Text>
              </Gap>
              <Scroller>

                {filteredContacts && filteredContacts.length ?
                  <Container>

                    <List>
                      {filteredContacts.map(el => (
                        <ListItem key={el.id} selection>
                          <Container relative onClick={this.onStartChat.bind(this, el)}>

                            <Container maxWidth="calc(100% - 75px)">
                              <Avatar>
                                <AvatarImage src={el.linkedUser.image}
                                             text={avatarNameGenerator(`${el.firstName} ${el.lastName}`).letter}
                                             textBg={avatarNameGenerator(`${el.firstName} ${el.lastName}`).color}/>
                                <AvatarName invert>
                                  {el.firstName} {el.lastName}
                                  {
                                    el.blocked
                                    &&
                                    <AvatarText>
                                      <Text size="xs" inline
                                            color="red">{strings.blocked}</Text>
                                    </AvatarText>
                                  }

                                </AvatarName>
                              </Avatar>
                            </Container>
                          </Container>
                        </ListItem>
                      ))}
                    </List>
                  </Container> :
                  <Container relative centerTextAlign>
                    <Gap y="8" x="5">
                      <Text size="sm" color="gray">{strings.noResult}</Text>
                    </Gap>
                  </Container>
                }
              </Scroller>
            </Fragment>
            }
          </Fragment>
        </Scroller>
      );
    }
  }
}

const exportDefault = withRouter(AsideThreads);
export {getTitle, sliceMessage, isFile, sanitizeRule, prettifyMessageDate, exportDefault as default};