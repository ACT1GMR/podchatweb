// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {sendMessage} from '../../actions/messageActions'
import {getThreadMessageList} from "../../actions/threadActions";

//components
import {List, ListItem} from '../../../ui_kit/components/list'
import {Avatar, AvatarText, AvatarImage} from "../../../ui_kit/components/avatar";
import {Loading, LoadingSpinner} from "../../../ui_kit/components/loading";
import {Message} from "../../../ui_kit/components/message";

//styling
import '../../../styles/pages/box/BoxScene.scss'

@connect(store => {
  return {
    threadMessages: store.threadMessages.messages,
    threadMessagesFetching: store.threadMessages.fetching,
    threadId: store.thread.thread.threadId,
    messageSent: store.message.sentMessage
  };
})
export default class BoxScene extends Component {

  constructor() {
    super();
    this.onTextChange = this.onTextChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      messageText: ""
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.threadId !== nextProps.threadId) {
      this.props.dispatch(getThreadMessageList(nextProps.threadId));
    }
    return true;
  }

  onFormSubmit(evt) {
    evt.preventDefault();
    this.props.dispatch(sendMessage(this.state.messageText, this.props.threadId));
    this.setState({messageText: ""});
  }

  onTextChange(event) {
    this.setState({messageText: event.target.value});
  }

  render() {
    const {threadMessagesFetching, threadMessages, threadId} = this.props;
    const {messageText} = this.state;
    let childElement;
    if (!threadId) {
      childElement = <Message>{strings.pleaseStartAThreadFirst}</Message>
    } else if (threadMessagesFetching) {
      childElement = <Loading><LoadingSpinner/></Loading>
    } else {
      childElement = (
        <div>
          <List>
            {threadMessages.map(el => (
              <ListItem key={el.id}>
                <Avatar>
                  <AvatarImage src=""/>
                  <AvatarText>{el.text}</AvatarText>
                </Avatar>
              </ListItem>
            ))}
          </List>
          <input type="text" onChange={this.onTextChange} value={messageText}/>
          <button type="submit">test</button>
        </div>
      )
    }
    return (
      <form onSubmit={this.onFormSubmit}>
        {childElement}

      </form>
    );
  }
}