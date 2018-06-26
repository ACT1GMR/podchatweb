// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import moment from 'moment';
import 'moment/locale/fa';
import date from "../../utils/date";
import {MdDoneAll, MdDone} from 'react-icons/lib/md'

//strings
import strings from '../../constants/localization';

//components
import List, {ListItem} from '../../../ui_kit/components/list'
import Avatar, {AvatarImage, AvatarName} from "../../../ui_kit/components/avatar";
import Loading, {LoadingSpinner} from "../../../ui_kit/components/loading";
import Content, {ContentFooter} from "../../../ui_kit/components/content";
import Container from "../../../ui_kit/components/container";

//styling
import '../../../styles/pages/box/BoxSceneMessages.scss'
import {getThreadMessageList} from "../../actions/threadActions";

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
  }

  componentDidUpdate() {
    let boxSceneMessages = this.boxSceneMessagesNode.current;
    if (boxSceneMessages) {
      boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
    }
  }

  render() {
    const {threadMessagesFetching, threadMessages, user} = this.props;
    const {defaultAvatar} = consts;
    if (threadMessagesFetching) {
      return <Loading><LoadingSpinner/></Loading>
    } else {
      const isByMe = (el) => {
        return el.participant.id === user.id;
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
        <Container inline={true} maxWidth="50%">
          <Content hasBackground={true} borderRadius={5}>
            {el.message}
            <ContentFooter>
              {seenAction(el)}
              {date.isToday(el.time) ? moment(el.time).format('hh:mm') : moment(el.time).format('dddd hh:mm')}
            </ContentFooter>
          </Content>
        </Container>;
      const avatar = el =>
        <Container inline={true} maxWidth="50px">
          <Avatar>
            <AvatarImage src={el.participant.image || defaultAvatar}/>
            <AvatarName bottom={true} small={true}>{el.participant.name}</AvatarName>
          </Avatar>
        </Container>;
      return (
        <div className="BoxSceneMessages" ref={this.boxSceneMessagesNode}>
          <List>
            {threadMessages.map(el => (
              <ListItem key={el.id}>
                <Container leftTextAlign={!isByMe(el)}>
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