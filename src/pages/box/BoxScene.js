// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames'

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
import AvatarName from "../../../ui_kit/components/avatar/AvatarName";

const classNames = {
  boxScene: 'BoxScene',
  boxSceneForm: 'BoxScene__form',
  boxSceneInputContainer: 'BoxScene__inputContainer',
  boxSceneMessageInput: 'BoxScene__messageInput',
  boxSceneMessageButton: 'BoxScene__messageButton'
};

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
    let childElement, chatInput;
    if (!threadId) {
      childElement = <Message>{strings.pleaseStartAThreadFirst}</Message>
    } else if (threadMessagesFetching) {
      childElement = <Loading><LoadingSpinner/></Loading>
    } else {
      childElement = (
        <List>
          {threadMessages.map(el => (
            <ListItem key={el.id}>
              <Avatar left={!el.byMe}>
                <div>
                  <AvatarImage src=""/>
                  <AvatarName bottom={true} small={true}>{el.participant.name}</AvatarName>
                </div>
                <AvatarText>{el.message}</AvatarText>
              </Avatar>
            </ListItem>
          ))}
        </List>
      );
      chatInput =
        <div className={classNames.boxSceneInputContainer}>
          <input className={classNames.boxSceneMessageInput}
                 type="text"
                 placeholder={strings.pleaseWriteHere}
                 onChange={this.onTextChange}
                 value={messageText}/>
          <button type="submit" className={classNames.boxSceneMessageButton}> ></button>
        </div>
    }
    return (
      <section className={classNames.boxScene}>
        <form onSubmit={this.onFormSubmit} className={classNames.boxSceneForm}>
          {childElement}
          {chatInput}
        </form>

      </section>
    );
  }
}