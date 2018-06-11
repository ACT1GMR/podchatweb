// src/list/BoxScene.jss
import React, {Component} from "react";
import {sendMessageService} from '../../actions/SendMessage'
import {getThreadMessageList} from '../../actions/GetThreadMessageList'
import {List, ListItem} from '../../../ui_kit/components/list'
import {connect} from "react-redux";
import '../../../styles/pages/box/BoxScene.scss'


class BoxScene extends Component {

  constructor() {
    super();
    this.state = {messages: null, messageSent: null, threadId: null};
  }

  componentDidMount(){
    this.props.dispatch(getThreadMessageList(this.props.threadId));
  }

  onFromSubmit() {
    this.props.dispatch(sendMessageService(this.state.messageText, this.props.threadId))
  }

  render() {
    return (
      <form onSubmit={this.onFromSubmit}>
        <List>
          {this.props.articles.map(el => (
            <ListItem key={el.id}>
              <Avatar>
                <AvatarImage src={}></AvatarImage>
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
    messageSent: state.messageSent
  };
};

export default connect(mapStateToProps)(BoxScene);
