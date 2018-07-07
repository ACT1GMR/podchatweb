// src/list/BoxScene.jss
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import moment from 'moment';
import 'moment/locale/fa';
import date from "../../utils/date";
import {MdDoneAll, MdDone} from 'react-icons/lib/md'

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
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.fetching,
    user: store.user.user
  };
})
export default class BoxSceneMessages extends Component {

  constructor(props) {
    super(props);
    this.boxSceneMessagesNode = React.createRef();
    this.messageListNode = React.createRef();
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

  componentDidUpdate() {
    let boxSceneMessages = this.boxSceneMessagesNode.current;
    if (boxSceneMessages) {
      boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
      const {threadMessages} = this.props;
      const lastMessage = threadMessages[threadMessages.length - 1];
      if (!~this.seenMessages.indexOf(lastMessage.uniqueId)) {
        if (!lastMessage.seen && !this._isMessageByMe(lastMessage)) {
          this.seenMessages.push(lastMessage.uniqueId);
          this.props.dispatch(messageSeen(lastMessage));
        }
      }
    }
  }

  render() {
    const {threadMessagesFetching, threadMessages} = this.props;
    const {defaultAvatar} = consts;
    if (threadMessagesFetching) {
      return (
        <Container center={true}>
          <Message large={true}>{strings.waitingForMessageFetching}</Message>
          <Loading><LoadingBlinkDots/></Loading>
        </Container>
      )
    } else {
      const isByMe = (el) => {
        return this._isMessageByMe(el);
      };
      const seenAction = (el) => {
        if (!isByMe(el)) {
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
              {date.isToday(el.time) ? moment(el.time).format('hh:mm') : moment(el.time).format('dddd hh:mm')}
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
        <div className="BoxSceneMessages" ref={this.boxSceneMessagesNode}>
          <List ref={this.messageListNode}>
            {threadMessages.map(el => (
              <ListItem key={el.id} data={el}>
                <Container leftTextAlign={!isByMe(el)} inSpace={true}>
                  {!isByMe(el) ? message(el) : avatar(el)}
                  {!isByMe(el) ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
  }
}