// src/list/BoxScene.jss
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import moment from 'moment';
import 'moment/locale/fa';
import date from "../../utils/date";
import {MdDoneAll, MdDone, MdChatBubbleOutline} from 'react-icons/lib/md';
import PersianDate from "persian-date";

//strings
import strings from '../../constants/localization';

//actions
import {getThreadMessageList} from "../../actions/threadActions";
import {messageSeen} from '../../actions/messageActions'

//components
import List, {ListItem} from '../../../ui_kit/components/list'
import Avatar, {AvatarImage, AvatarName} from "../../../ui_kit/components/avatar";
import Loading, {LoadingBlinkDots} from "../../../ui_kit/components/loading";
import Content, {ContentFooter} from "../../../ui_kit/components/content";
import Container from "../../../ui_kit/components/container";
import Message from "../../../ui_kit/components/message";

//styling
import '../../../styles/pages/box/BoxSceneMessages.scss'

const consts = {defaultAvatar: '/styles/images/_common/default-avatar.png'};

@connect(store => {
  return {
    threadMessagesHasNext: store.threadMessages.hasNext,
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.fetching,
    threadMessagesPartialFetching: store.threadMessagesPartial.fetching,
    user: store.user.user
  };
})
export default class BoxSceneMessages extends Component {

  constructor(props) {
    super(props);
    this.boxSceneMessagesNode = React.createRef();
    this.messageListNode = React.createRef();
    this.onScroll = this.onScroll.bind(this);
    this.seenMessages = [];
  }

  _isMessageByMe(message) {
    const {user} = this.props;
    if (user) {
      if (message) {
        return message.participant.id === user.id;
      }
    }
  }

  onScroll() {
    const {threadMessages, threadMessagesPartialFetching, threadMessagesHasNext} = this.props;
    if (threadMessagesHasNext) {
      const current = this.boxSceneMessagesNode.current;
      const scrollHeight = current.scrollHeight;
      const scrollTop = current.scrollTop;
      if (scrollTop <= (scrollHeight / 3)) {
        if (!threadMessagesPartialFetching) {
          this.props.dispatch(getThreadMessageList(threadMessages[0].threadId, (threadMessages.length / 50) * 50));
        }
      }
    }
  }

  componentDidUpdate() {
    let boxSceneMessages = this.boxSceneMessagesNode.current;
    if (boxSceneMessages) {
      const {threadMessages} = this.props;
      const lastMessage = threadMessages[threadMessages.length - 1];
      if (!this.lastMessage || this.lastMessage !== lastMessage.id) {
        boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
        this.lastMessage = lastMessage.id;
      }

      if (lastMessage) {
        if (!~this.seenMessages.indexOf(lastMessage.uniqueId)) {
          if (!lastMessage.seen && !this._isMessageByMe(lastMessage)) {
            this.seenMessages.push(lastMessage.uniqueId);
            this.props.dispatch(messageSeen(lastMessage));
          }
        }
      }
    }
  }

  render() {
    const {threadMessagesFetching, threadMessagesPartialFetching, threadMessages} = this.props;
    const {defaultAvatar} = consts;
    if (threadMessagesFetching) {
      return (
        <Container center={true}>
          <Message large={true}>{strings.waitingForMessageFetching}</Message>
          <Loading><LoadingBlinkDots/></Loading>
        </Container>
      )
    } else {
      let partialLoading = '';
      if (!threadMessages.length) {
        return (
          <Container center={true} centerTextAlign={true}>
            <Message large={true}>{strings.thereIsNoMessageToShow}</Message>
            <MdChatBubbleOutline size={48} style={{color: "#f58220"}}/>
          </Container>
        )
      }
      if (threadMessagesPartialFetching) {
        partialLoading =
          (
            <Container topCenter={true} centerTextAlign={true}>
              <Loading><LoadingBlinkDots small={true}/></Loading>
            </Container>
          )
      }
      const seenAction = (el) => {
        if (!this._isMessageByMe(el)) {
          return null;
        }
        if (el.seen) {
          return <MdDoneAll size={16} style={{margin: "0 5px"}}/>
        }
        return <MdDone size={16} style={{margin: "0 5px"}}/>
      };
      const message = el =>
        <Container inline={true} maxWidth="50%" inSpace={true}>
          <Content hasBackground={true} borderRadius={5}>
            {el.message}
            <ContentFooter>
              {seenAction(el)}
              {date.isToday(el.time) ? date.format(el.time, "hh:mm") : date.isWithinAWeek(el.time) ? date.format(el.time, "YYYY-MM-DD dddd hh:mm") : date.format(el.time, "YYYY-MM-DD  hh:mm")}
            </ContentFooter>
          </Content>
        </Container>;
      const avatar = el =>
        <Container inline={true} maxWidth="50px" inSpace={true}>
          <Avatar>
            <AvatarImage src={el.participant.image || defaultAvatar}/>
            <AvatarName bottom={true} small={true}>{el.participant.name}</AvatarName>
          </Avatar>
        </Container>;
      return (
        <div className="BoxSceneMessages" ref={this.boxSceneMessagesNode} onScroll={this.onScroll}>
          <List ref={this.messageListNode}>
            {threadMessagesPartialFetching && partialLoading}
            {threadMessages.map(el => (
              <ListItem key={el.id} data={el}>
                <Container leftTextAlign={!this._isMessageByMe(el)} inSpace={true}>
                  {!this._isMessageByMe(el) ? message(el) : avatar(el)}
                  {!this._isMessageByMe(el) ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
  }
}