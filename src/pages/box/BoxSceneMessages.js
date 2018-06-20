// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization';

//components
import List, {ListItem} from '../../../ui_kit/components/list'
import Avatar, {AvatarImage, AvatarName} from "../../../ui_kit/components/avatar";
import Loading, {LoadingSpinner} from "../../../ui_kit/components/loading";
import Content from "../../../ui_kit/components/content";
import Container from "../../../ui_kit/components/container";

//styling
import '../../../styles/pages/box/BoxSceneMessages.scss'
import {getThreadMessageList} from "../../actions/threadActions";

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

  isByMe(message) {
    return message.participant.id === this.props.user.id;
  }

  componentDidUpdate() {
    let boxSceneMessages = this.boxSceneMessagesNode.current;
    if (boxSceneMessages) {
      boxSceneMessages.scrollTop = boxSceneMessages.scrollHeight;
    }
  }

  render() {
    const {threadMessagesFetching, threadMessages} = this.props;
    if (threadMessagesFetching) {
      return <Loading><LoadingSpinner/></Loading>
    } else {
      const message = el =>
        <Container inline={true} maxWidth="50%">
          <Content hasBackground={true} borderRadius={5}>{el.message}</Content>
        </Container>;
      const avatar = el =>
        <Container inline={true} maxWidth="50px">
          <Avatar>
            <AvatarImage src=""/>
            <AvatarName bottom={true} small={true}>{el.participant.name}</AvatarName>
          </Avatar>
        </Container>;
      return (
        <div className="BoxSceneMessages" ref={this.boxSceneMessagesNode}>
          <List>
            {threadMessages.map(el => (
              <ListItem key={el.id}>
                <Container leftTextAlign={!this.isByMe(el)}>
                  {!this.isByMe(el) ? message(el) : avatar(el)}
                  {!this.isByMe(el) ? avatar(el) : message(el)}
                </Container>
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
  }
}