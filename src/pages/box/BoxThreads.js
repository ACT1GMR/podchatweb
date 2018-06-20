// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {getContactList} from '../../actions/contactActions'
import {createThread, getThreads, getThreadMessageList} from "../../actions/threadActions";
import {addArticle} from "../../actions/messageActions";

//UI components
import Avatar, {AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import List, {ListItem} from '../../../ui_kit/components/list'

//styling
import '../../../styles/pages/box/BoxThreads.scss'

@connect(store => {
  return {
    threads: store.threadList.threads,
    message: store.message.message,
    threadId: store.thread.thread.id
  };
})
export default class BoxThreads extends Component {

  constructor(props) {
    super(props);
    this.onThreadClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getThreads());
  }

  componentDidUpdate() {

  }

  onThreadClick(thread) {
    this.props.dispatch(createThread(null, thread));
  }

  render() {
    const {threads} = this.props;
    return (
      <section className="BoxThreads">
        <List>
          {threads.map(el => (
            <ListItem key={el.id} onClick={this.onThreadClick.bind(this, el)} selection={true}>
              <Avatar>
                <AvatarImage/>
                <AvatarName textInvert={true}>{el.title}</AvatarName>
              </Avatar>
            </ListItem>
          ))}
        </List>
      </section>
    );
  }
};
