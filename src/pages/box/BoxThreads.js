// src/list/Avatar.scss.js
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import strings from "../../constants/localization"

//actions
import {threadCreate, threadGetList, threadMessageGetList, getThreadInfo} from "../../actions/threadActions";

//UI components
import Avatar, {AvatarImage, AvatarName} from "../../../../uikit/src/avatar";
import List, {ListItem} from "../../../../uikit/src/list";
import Shape, {ShapeCircle} from "../../../../uikit/src/shape";
import Container from "../../../../uikit/src/container";
import LoadingBlinkDots from "../../../../uikit/src/loading/LoadingBlinkDots";
import Loading from "../../../../uikit/src/loading";

//styling
import style from "../../../styles/pages/box/BoxThreads.scss";
import defaultAvatar from "../../../styles/images/_common/default-avatar.png"

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
    this.state = {activeThread: null};
  }

  componentDidMount() {
    this.props.dispatch(threadGetList());
  }

  onThreadClick(thread) {
    this.props.dispatch(threadCreate(null, thread));
    this.setState({
      activeThread: thread.id
    })
  }

  render() {
    const {threads} = this.props;
    const {activeThread} = this.state;
    if (!threads.length) {
      return (
        <section className={style.BoxThreads}>
          <Loading><LoadingBlinkDots invert={true} rtl={true}/></Loading>
        </section>
      )
    } else {
      return (
        <section className={style.BoxThreads}>
          <List>
            {threads.map(el => (
              <ListItem key={el.id} onClick={this.onThreadClick.bind(this, el)} selection={true} active={activeThread === el.id}>
                <Container relative={true}>
                  <Avatar>
                    <AvatarImage src={el.image ? el.image : defaultAvatar}/>
                    <AvatarName textInvert={true}>{el.title}</AvatarName>
                  </Avatar>
                  {el.unreadCount && activeThread !== el.id ?
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
