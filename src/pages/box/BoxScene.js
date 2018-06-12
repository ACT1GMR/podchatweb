// src/list/BoxScene.jss
import React, {Component} from "react";
import {addArticle, sendMessageService} from '../../actions/messageActions'
import {getThreadMessageListService} from '../../actions/threadActions'
import {threadActions} from '../../actions/threadActions'
import {List, ListItem} from '../../../ui_kit/components/list'
import {connect} from "react-redux";
import '../../../styles/pages/box/BoxScene.scss'


class BoxScene extends Component {

  constructor() {
    super();
    this.state = {messages: null, messageSent: null, threadId: null};
  }

  componentDidMount(){
    this.props.dispatch(getThreadMessageListService(this.props.threadId));
  }

  onFromSubmit() {
    this.props.dispatch(sendMessageService(this.state.messageText, this.props.threadId))
  }

  render() {
    return (
      <form onSubmit={this.onFromSubmit}>
        <List>
          {this.props.messages.map(el => (
            <ListItem key={el.id}>
              <Avatar>
                <AvatarImage src=""></AvatarImage>
              </Avatar>
            </ListItem>
          ))}
        </List>
        <input type="text"/>
        <button type="submit">test</button>
      </form>
    );
  }
}


const mapStateToProps = state => {
  return {
    messages: state.messages,
    messageSent: state.messageSent,
    threadId: state.threadId
  };
};


export default connect(mapStateToProps)(BoxScene);
