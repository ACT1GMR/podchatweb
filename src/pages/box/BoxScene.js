// src/list/BoxScene.jss
import React, {Component} from "react";
import {sendMessage} from '../../actions/messageActions'
import {List, ListItem} from '../../../ui_kit/components/list'
import {connect} from "react-redux";
import '../../../styles/pages/box/BoxScene.scss'
import {Avatar, AvatarText, AvatarImage} from "../../../ui_kit/components/avatar";
import {Loading, LoadingSpinner} from "../../../ui_kit/components/loading";

@connect(store => {
  return {
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.isFetching,
    messageSent: store.message.sentMessage
  };
})
export default class BoxScene extends Component {

  constructor() {
    super();
  }

  onFromSubmit() {
    this.props.dispatch(sendMessage(this.state.messageText, this.props.threadId))
  }

  render() {
    const {threadMessagesFetching, threadMessages} = this.props;
    let childElement;
    if (threadMessagesFetching) {
      childElement = <Loading><LoadingSpinner/></Loading>
    } else {
      childElement =
        <List>
          {threadMessages.map(el => (
            <ListItem key={el.id}>
              <Avatar>
                <AvatarImage src=""></AvatarImage>
                <AvatarText>{el.message}</AvatarText>
              </Avatar>
            </ListItem>
          ))}
        </List>
    }
    return (
      <form onSubmit={this.onFromSubmit}>
        {childElement}
        <button type="submit">test</button>
      </form>
    );
  }
}