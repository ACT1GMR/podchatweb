// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from '../../constants/localization'

//actions
import {getContactList} from '../../actions/contactActions'
import {threadCreat, getThreads, getThreadMessageList, getThreadInfo} from "../../actions/threadActions";

//UI components
import Avatar, {AvatarImage, AvatarName} from '../../../ui_kit/components/avatar'
import List, {ListItem} from '../../../ui_kit/components/list'
import Shape, {ShapeCircle} from '../../../ui_kit/components/shape'

//styling
import "../../../styles/pages/box/BoxThreads.scss";
import Container from "../../../ui_kit/components/container";
import LoadingBlinkDots from "../../../ui_kit/components/loading/LoadingBlinkDots";
import Loading from "../../../ui_kit/components/loading";

const consts = {defaultAvatar: '/styles/images/_common/default-avatar.png'};

@connect(store => {
  return {
    threads: store.threadList.threads,
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

  shouldComponentUpdate() {
    return true;
  }

  onThreadClick(thread) {
    this.props.dispatch(threadCreat(null, thread));
  }

  render() {
    let {threads} = this.props;
    const {defaultAvatar} = consts;
    if (!threads.length) {
      return (
        <section className="BoxThreads">
          <Loading><LoadingBlinkDots invert={true} rtl={true}/></Loading>
        </section>
      )
    } else {
      return (
        <section className="BoxThreads">
          <List>
            {threads.map(el => (
              <ListItem key={el.id} onClick={this.onThreadClick.bind(this, el)} selection={true}>
                <Container relative={true}>
                  <Avatar>
                    <AvatarImage src={el.image ? el.image : defaultAvatar}/>
                    <AvatarName textInvert={true}>{el.title}</AvatarName>
                  </Avatar>
                  {el.unreadCount ?
                    <Container absolute={true} centerLeft={true}>
                      <Shape cirlce={true} colorAccent={true}>
                        <ShapeCircle>{el.unreadCount}</ShapeCircle>
                      </Shape>
                    </Container> : ""}
                </Container>
              </ListItem>
            ))}
          </List>
        </section>
      );
    }
  }
};