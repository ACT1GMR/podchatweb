// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization';

//components
import List, {ListItem} from '../../../ui_kit/components/list'
import Avatar, {AvatarImage, AvatarName} from "../../../ui_kit/components/avatar";
import Loading, {LoadingSpinner} from "../../../ui_kit/components/loading";
import Message from "../../../ui_kit/components/message";
import Content from "../../../ui_kit/components/content";
import Container from "../../../ui_kit/components/container";

//styling
import '../../../styles/pages/box/BoxSceneMessages.scss'

@connect(store => {
  return {
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.fetching,
    messageSent: store.message.sentMessage
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
    const {threadMessagesFetching, threadMessages} = this.props;
    let childElement;
    if (threadMessagesFetching) {
      childElement = <Loading><LoadingSpinner/></Loading>
    } else {
      const message = el =>
        <Container inline={true} maxWidth={50}>
          <Content hasBackground={true} borderRadius={5}>{el.message}</Content>
        </Container>;
      const avatar = el =>
        <Container inline={true}>
          <Avatar>
            <AvatarImage src=""/>
            <AvatarName bottom={true} small={true}>{el.participant.name}</AvatarName>
          </Avatar>
        </Container>;
      childElement = (
        <div className="BoxSceneMessages" ref={this.boxSceneMessagesNode}>
          <List>
            {threadMessages.map(el => (
              <ListItem key={el.id}>
                <Container leftTextAlign={!el.byMe}>
                  {!el.byMe ? message(el) : avatar(el)}
                  {!el.byMe ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
    return childElement;
  }
}